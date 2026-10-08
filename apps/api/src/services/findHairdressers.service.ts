import { prisma } from "../../lib/prisma.js";

type Coordinates = {
  lat: number;
  lng: number;
};

type HairdresserFilters = {
  location?: Coordinates;
  distanceKm?: number;
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
  distanceKm,
  hasDbsCheck,
}: HairdresserFilters) {
  const distanceM = distanceKm === undefined ? undefined : distanceKm * 1000;
  const latitudeDelta =
    location && distanceM !== undefined
      ? distanceM / 111_320
      : undefined;

  const hairdressers = await prisma.hairdresser.findMany({
    where: {
      ...({dbsVerified: hasDbsCheck}),
      ...(location && latitudeDelta !== undefined
        ? {
            serviceCenterLat: {
              gte: Math.max(-90, location.lat - latitudeDelta),
              lte: Math.min(90, location.lat + latitudeDelta),
            },
          }
        : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      bio: true,
      yearsOfExperience: true,
      dbsVerified: true,
      serviceCenterLat: true,
      serviceCenterLng: true,
      serviceRadiusM: true,
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

  return hairdressers.flatMap((hairdresser) => {
    const hairdresserDistanceM = location
      ? distanceInMeters(location, {
          lat: hairdresser.serviceCenterLat,
          lng: hairdresser.serviceCenterLng,
        })
      : undefined;

    if (
      hairdresserDistanceM !== undefined &&
      (hairdresserDistanceM > hairdresser.serviceRadiusM ||
        (distanceM !== undefined && hairdresserDistanceM > distanceM))
    ) {
      return [];
    }

    return [
      {
        id: hairdresser.id,
        name: hairdresser.name,
        mapLat: Math.round(hairdresser.serviceCenterLat * 100) / 100,
        mapLng: Math.round(hairdresser.serviceCenterLng * 100) / 100,
        bio: hairdresser.bio,
        yearsOfExperience: hairdresser.yearsOfExperience,
        dbsVerified: hairdresser.dbsVerified,
        services: hairdresser.services,
        ...(hairdresserDistanceM === undefined
          ? {}
          : {
              distanceKm:
                Math.round((hairdresserDistanceM / 1000) * 10) / 10,
            }),
      },
    ];
  });
}
