export interface Hairdresser {
  id: string;
  name: string;
  serviceArea: GeoLocation[];
  services: Service[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Service {
  name: string;
  price: number;
}

export type { RegisterRequest, RegistrationService } from "./types/registration";