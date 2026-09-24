import { prisma } from "../../lib/prisma.js";
import type { RegisterRequest } from "@geocutters/shared";

export type RegisterPayload = RegisterRequest;

type NormalizedService = {
  name: string;
  price: number;
  durationMinutes: number;
};

type NormalizedRegistration = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  serviceCenterLat: number;
  serviceCenterLng: number;
  serviceRadiusM: number;
  services: NormalizedService[];
  bio?: string;
  yearsOfExperience?: number;
  dbsVerified: boolean;
};

export class RegistrationValidationError extends Error {}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new RegistrationValidationError(`${field} is required`);
  }

  return value.trim();
}

function finiteNumber(value: unknown, field: string): number {
  const number = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(number)) {
    throw new RegistrationValidationError(`${field} must be a number`);
  }

  return number;
}

function positiveInteger(value: unknown, field: string): number {
  const number = finiteNumber(value, field);

  if (!Number.isInteger(number) || number <= 0) {
    throw new RegistrationValidationError(`${field} must be a positive integer`);
  }

  return number;
}

function normalizeExperience(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }

  throw new RegistrationValidationError(
    "experience must be a non-negative integer",
  );
}

function normalizePayload(payload: RegisterPayload): NormalizedRegistration {
  const email = requiredString(payload.email, "email").toLowerCase();
  if (!email.includes("@")) {
    throw new RegistrationValidationError("email is invalid");
  }

  if (!Array.isArray(payload.services) || payload.services.length === 0) {
    throw new RegistrationValidationError("at least one service is required");
  }

  const services = payload.services.map((service, index) => {
    if (!service || typeof service !== "object") {
      throw new RegistrationValidationError(`services[${index}] is invalid`);
    }

    const item = service as Record<string, unknown>;
    return {
      name: requiredString(item.name, `services[${index}].name`),
      price: finiteNumber(item.price, `services[${index}].price`),
      durationMinutes: positiveInteger(
        item.duration ?? item.durationMinutes,
        `services[${index}].duration`,
      ),
    };
  });

  const bio = payload.bio === undefined || payload.bio === null
    ? undefined
    : requiredString(payload.bio, "bio");
  const phone = payload.phone === null || payload.phone === undefined || payload.phone === ""
    ? undefined
    : requiredString(payload.phone, "phone");
  const yearsOfExperience = normalizeExperience(payload.experience);

  return {
    name: requiredString(payload.name, "name"),
    email,
    password: requiredString(payload.password, "password"),
    serviceCenterLat: finiteNumber(payload.lat, "lat"),
    serviceCenterLng: finiteNumber(payload.lng, "lng"),
    serviceRadiusM: positiveInteger(payload.radius, "radius"),
    services,
    ...(bio === undefined ? {} : { bio }),
    ...(phone === undefined ? {} : { phone }),
    ...(yearsOfExperience === undefined ? {} : { yearsOfExperience }),
    dbsVerified: payload.dbs === true,
  };
}

export async function registerHairdresser(payload: RegisterPayload) {
  const registration = normalizePayload(payload);

  return prisma.hairdresser.create({
    data: {
      ...registration,
      services: {
        create: registration.services,
      },
    },
    include: { services: true },
  });
}