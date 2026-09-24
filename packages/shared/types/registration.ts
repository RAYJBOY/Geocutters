export type RegistrationService = {
  name: string;
  price: string;
  duration: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  radius: number;
  services: RegistrationService[];
  bio: string;
  experience: number | null;
  dbs: boolean;
};