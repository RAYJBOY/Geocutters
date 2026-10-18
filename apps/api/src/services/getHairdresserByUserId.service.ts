import { prisma } from "../../lib/prisma.js";
import type { HairdresserProfileUpdateRequest } from "@geocutters/shared";
import { RegistrationValidationError } from "./registration.errors.js";

function parseHairdresserProfile(
  input: unknown,
): HairdresserProfileUpdateRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new RegistrationValidationError("A hairdresser profile is required");
  }

  const body = input as Record<string, unknown>;
  const requiredString = (value: unknown, field: string) => {
    if (typeof value !== "string" || value.trim() === "") {
      throw new RegistrationValidationError(`${field} is required`);
    }
    return value.trim();
  };
  const finiteNumber = (value: unknown, field: string) => {
    const number = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(number)) {
      throw new RegistrationValidationError(`${field} must be a number`);
    }
    return number;
  };
  const serviceCenterLat = finiteNumber(body.serviceCenterLat, "Latitude");
  const serviceCenterLng = finiteNumber(body.serviceCenterLng, "Longitude");
  if (serviceCenterLat < -90 || serviceCenterLat > 90) {
    throw new RegistrationValidationError("Latitude must be between -90 and 90");
  }
  if (serviceCenterLng < -180 || serviceCenterLng > 180) {
    throw new RegistrationValidationError("Longitude must be between -180 and 180");
  }

  const serviceRadiusM = finiteNumber(body.serviceRadiusM, "Service radius");
  if (!Number.isInteger(serviceRadiusM) || serviceRadiusM < 1) {
    throw new RegistrationValidationError("Service radius must be a positive integer");
  }

  let yearsOfExperience: number | null = null;
  if (body.yearsOfExperience !== null && body.yearsOfExperience !== "") {
    yearsOfExperience = finiteNumber(body.yearsOfExperience, "Experience");
    if (!Number.isInteger(yearsOfExperience) || yearsOfExperience < 0) {
      throw new RegistrationValidationError(
        "Experience must be a non-negative integer",
      );
    }
  }

  if (!Array.isArray(body.services) || body.services.length === 0) {
    throw new RegistrationValidationError("At least one service is required");
  }
  const services = body.services.map((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new RegistrationValidationError(`Service ${index + 1} is invalid`);
    }
    const service = value as Record<string, unknown>;
    const price = finiteNumber(service.price, `Service ${index + 1} price`);
    const durationMinutes = finiteNumber(
      service.durationMinutes,
      `Service ${index + 1} duration`,
    );
    if (price < 0) {
      throw new RegistrationValidationError("Service prices cannot be negative");
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      throw new RegistrationValidationError(
        "Service duration must be a positive integer",
      );
    }
    return {
      name: requiredString(service.name, `Service ${index + 1} name`),
      price,
      durationMinutes,
    };
  });

  const optionalString = (value: unknown, field: string) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value !== "string") {
      throw new RegistrationValidationError(`${field} must be text`);
    }
    return value.trim() || null;
  };

  return {
    name: requiredString(body.name, "Name"),
    phone: optionalString(body.phone, "Phone"),
    bio: optionalString(body.bio, "Bio"),
    yearsOfExperience,
    serviceCenterLat,
    serviceCenterLng,
    serviceRadiusM,
    services,
  };
}

export async function getHairdresserByUserId(userId: string) {
  return prisma.hairdresser.findUnique({
    where: { supabaseUserId: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
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
}

export async function updateHairdresserNameByUserId(
  userId: string,
  name: string,
  email: string,
) {
  return prisma.hairdresser.updateMany({
    where: { supabaseUserId: userId },
    data: { name, email },
  });
}

export async function updateHairdresserByUserId(
  userId: string,
  email: string,
  input: unknown,
) {
  const profile = parseHairdresserProfile(input);

  return prisma.hairdresser.update({
    where: { supabaseUserId: userId },
    data: {
      ...profile,
      email,
      services: {
        deleteMany: {},
        create: profile.services,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
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
}
