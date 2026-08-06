// src/lib/permisos.ts
// Logica central de permisos. Un solo lugar para no repetir la regla en cada pantalla/API.

export type NivelAcceso = "ADMIN" | "USUARIO";
export type NivelPermiso = "SIN_ACCESO" | "LECTURA" | "ESCRITURA";
export type Modulo =
  | "DISPONIBILIDAD"
  | "VIAJES"
  | "PLANNING"
  | "RENDICIONES"
  | "CIERRE_FACTURACION";

export const MODULOS: { valor: Modulo; label: string }[] = [
  { valor: "DISPONIBILIDAD", label: "Disponibilidad" },
  { valor: "VIAJES", label: "Viajes / Asignación" },
  { valor: "PLANNING", label: "Planning" },
  { valor: "RENDICIONES", label: "Rendiciones" },
  { valor: "CIERRE_FACTURACION", label: "Cierre Facturación" },
];

// Forma en la que guardamos los permisos dentro del JWT / session
export type PermisosMap = Partial<Record<Modulo, NivelPermiso>>;

/** ADMIN siempre tiene ESCRITURA en todo. USUARIO depende de su mapa de permisos (default SIN_ACCESO). */
export function nivelEnModulo(
  nivelAcceso: NivelAcceso,
  permisos: PermisosMap,
  modulo: Modulo
): NivelPermiso {
  if (nivelAcceso === "ADMIN") return "ESCRITURA";
  return permisos[modulo] ?? "SIN_ACCESO";
}

export function puedeVer(nivelAcceso: NivelAcceso, permisos: PermisosMap, modulo: Modulo) {
  return nivelEnModulo(nivelAcceso, permisos, modulo) !== "SIN_ACCESO";
}

export function puedeEscribir(nivelAcceso: NivelAcceso, permisos: PermisosMap, modulo: Modulo) {
  return nivelEnModulo(nivelAcceso, permisos, modulo) === "ESCRITURA";
}

export function esAdmin(nivelAcceso: NivelAcceso) {
  return nivelAcceso === "ADMIN";
}

// Mapea una ruta de la app a su modulo, para el middleware
export function moduloDeRuta(pathname: string): Modulo | null {
  if (pathname.startsWith("/disponibilidad")) return "DISPONIBILIDAD";
  if (pathname.startsWith("/viajes")) return "VIAJES";
  if (pathname.startsWith("/planning")) return "PLANNING";
  if (pathname.startsWith("/rendiciones")) return "RENDICIONES";
  if (pathname.startsWith("/cierre-facturacion")) return "CIERRE_FACTURACION";
  return null; // rutas no restringidas por modulo (panel, login, configuracion maneja su propio check de ADMIN)
}
