import type { ServiceName } from "./services";

export type HairdresserService = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
};

export type HairdresserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
  dbsVerified: boolean;
  serviceCenterLat: number;
  serviceCenterLng: number;
  serviceRadiusM: number;
  services: HairdresserService[];
};

export type HairdresserProfileFormService = {
  id?: string;
  name: string;
  price: string;
  durationMinutes: string;
};

export type HairdresserProfileForm = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  yearsOfExperience: string;
  serviceCenterLat: string;
  serviceCenterLng: string;
  serviceRadiusM: string;
  services: HairdresserProfileFormService[];
};

export type HairdresserProfileResponse = {
  hairdresser?: HairdresserProfile;
  error?: string;
};

export type HairdresserProfileUpdateRequest = {
  name: string;
  phone: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
  serviceCenterLat: number;
  serviceCenterLng: number;
  serviceRadiusM: number;
  services: {
    name: ServiceName;
    price: number;
    durationMinutes: number;
  }[];
};

export type HairdresserSearchResponse = {
  hairdressers?: HairdresserSearchResult[];
  error?: string;
};

export type PublicHairdresserProfile = Omit<
  HairdresserProfile,
  "serviceCenterLat" | "serviceCenterLng" | "serviceRadiusM" | "services"
> & {
  services?: HairdresserProfile["services"];
};

export type PublicHairdresserProfileResponse = {
  hairdresser?: PublicHairdresserProfile;
  error?: string;
};

export type HairdresserSearchResult = {
  id: string;
  name: string;
  yearsOfExperience: number | null;
  dbsVerified: boolean;
  distanceKm: number;
};
