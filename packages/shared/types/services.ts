export const SERVICE_NAMES = [
  "Wash, cut and dry",
  "Ladies dry cut",
  "Curly blow dry",
  "Hair styling / occasion hair",
  "Kids haircut",
  "Gents haircut",
  "Full colour",
  "Half head highlights",
  "Full head highlights",
  "Balayage",
] as const;

export type ServiceName = (typeof SERVICE_NAMES)[number];

export function isServiceName(value: unknown): value is ServiceName {
  return SERVICE_NAMES.some((serviceName) => serviceName === value);
}
