import { prisma } from "../../lib/prisma.js";
import { isServiceName, type CompleteRegistrationRequest } from "@geocutters/shared";
import { RegistrationValidationError } from "./registration.errors";

export type RegisterPayload = CompleteRegistrationRequest;

type NormalizedService = {
  name: string;
  price: number;
  durationMinutes: number;
};

type NormalizedRegistration = {
  name: string;
  email: string;
  supabaseUserId: string;
  phone?: string;
  serviceCenterLat: number;
  serviceCenterLng: number;
  serviceRadiusM: number;
  services: NormalizedService[];
  bio?: string;
  yearsOfExperience?: number;
  dbsVerified: boolean;
};

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new RegistrationValidationError(`${field} is required`);
  }

  return value.trim();
}

function finiteNumber(value: unknown, field: string): number {
  if (value === null || value === undefined || value === "") {
    throw new RegistrationValidationError(`${field} must be a number`);
  }

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

function normalizePayload(
  payload: RegisterPayload & { email: string; supabaseUserId: string },
): NormalizedRegistration {
  if (!Array.isArray(payload.services) || payload.services.length === 0) {
    throw new RegistrationValidationError("at least one service is required");
  }

  const services = payload.services.map((service, index) => {
    if (!service || typeof service !== "object") {
      throw new RegistrationValidationError(`services[${index}] is invalid`);
    }

    const item = service as Record<string, unknown>;
    const name = requiredString(item.name, `services[${index}].name`);
    if (!isServiceName(name)) {
      throw new RegistrationValidationError(
        `services[${index}].name must be one of the available service options`,
      );
    }
    return {
      name,
      price: finiteNumber(item.price, `services[${index}].price`),
      durationMinutes: positiveInteger(
        item.duration ?? item.durationMinutes,
        `services[${index}].duration`,
      ),
    };
  });

  const bio =
    typeof payload.bio === "string" && payload.bio.trim() !== ""
      ? payload.bio.trim()
      : undefined;
  const phone = payload.phone === null || payload.phone === undefined || payload.phone === ""
    ? undefined
    : requiredString(payload.phone, "phone");
  const yearsOfExperience = normalizeExperience(payload.experience);

  return {
    name: requiredString(payload.name, "name"),
    email: payload.email,
    supabaseUserId: payload.supabaseUserId,
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

export async function registerHairdresser(
  payload: RegisterPayload,
  user: { id: string; email: string },
) {
  const registration = normalizePayload({
    ...payload,
    email: requiredString(user.email, "account email").toLowerCase(),
    supabaseUserId: requiredString(user.id, "account id"),
  });

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