import { prisma } from "../../lib/prisma.js";
import type {
  HairdresserSearchResult,
  PublicHairdresserProfile,
} from "@geocutters/shared";

type Coordinates = {
  lat: number;
  lng: number;
};

type HairdresserFilters = {
  location: Coordinates;
  hasDbsCheck: boolean;
};

function distanceInMeters(
  origin: Coordinates,
  destination: Coordinates,
): number {
  const earthRadiusM = 6_371_000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latDifference = toRadians(destination.lat - origin.lat);
  const lngDifference = toRadians(destination.lng - origin.lng);
  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(lngDifference / 2) ** 2;

  return 2 * earthRadiusM * Math.asin(Math.sqrt(haversine));
}

export async function findHairdressers({
  location,
  hasDbsCheck,
}: HairdresserFilters) {
  const hairdressers = await prisma.hairdresser.findMany({
    where: {
      ...(hasDbsCheck ? { dbsVerified: true } : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      yearsOfExperience: true,
      dbsVerified: true,
      serviceCenterLat: true,
      serviceCenterLng: true,
      serviceRadiusM: true,
    },
  });

  const matches: { hairdresser: HairdresserSearchResult; distanceM: number }[] =
    [];

  for (const hairdresser of hairdressers) {
    const distanceM = distanceInMeters(location, {
      lat: hairdresser.serviceCenterLat,
      lng: hairdresser.serviceCenterLng,
    });

    if (distanceM > hairdresser.serviceRadiusM) {
      continue;
    }

    matches.push({
      distanceM,
      hairdresser: {
        id: hairdresser.id,
        name: hairdresser.name,
        yearsOfExperience: hairdresser.yearsOfExperience,
        dbsVerified: hairdresser.dbsVerified,
        distanceKm: Math.round((distanceM / 1000) * 10) / 10,
      },
    });
  }

  return matches
    .sort((a, b) => a.distanceM - b.distanceM)
    .map(({ hairdresser }) => hairdresser);
}

export async function getPublicHairdresserProfile(
  hairdresserId: string,
): Promise<PublicHairdresserProfile | null> {
  return prisma.hairdresser.findUnique({
    where: { id: hairdresserId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      yearsOfExperience: true,
      dbsVerified: true,
      services: {
        select: {
          id: true,
          name: true,
          price: true,
          durationMinutes: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });
}
