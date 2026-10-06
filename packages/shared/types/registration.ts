export type RegistrationService = {
  name: string;
  price: string;
  duration: string;
};

export type CompleteRegistrationRequest = {
  name: string;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  radius: number;
  services: RegistrationService[];
  bio?: string | null;
  experience: number | null;
  dbs: boolean;
};