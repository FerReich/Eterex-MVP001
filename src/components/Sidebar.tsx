"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { puedeVer, type Modulo } from "@/lib/permisos";

const links: { href: string; label: string; modulo: Modulo | null }[] = [
  { href: "/", label: "Panel", modulo: null }, // el Panel siempre se ve
  { href: "/disponibilidad", label: "Disponibilidad", modulo: "DISPONIBILIDAD" },
  { href: "/viajes", label: "Viajes / Asignación", modulo: "VIAJES" },
  { href: "/planning", label: "Planning", modulo: "PLANNING" },
  { href: "/rendiciones", label: "Rendiciones", modulo: "RENDICIONES" },
  { href: "/cierre-facturacion", label: "Cierre facturación", modulo: "CIERRE_FACTURACION" },
];

export default function Sidebar({ nombre, rol }: { nombre: string; rol: string }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const nivelAcceso = (session?.user as any)?.nivelAcceso as "ADMIN" | "USUARIO" | undefined;
  const permisos = (session?.user as any)?.permisos ?? {};
  const esAdmin = nivelAcceso === "ADMIN";

  // Mientras carga la sesion mostramos todo para evitar parpadeo; una vez cargada, filtramos.
  const linksVisibles =
    status === "authenticated"
      ? links.filter((l) => l.modulo === null || puedeVer(nivelAcceso!, permisos, l.modulo))
      : links;

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r border-neutral-800 min-h-screen flex flex-col">
      <div className="p-5 border-b border-neutral-800">
        <p className="text-white font-semibold text-sm">eTerex Distribución</p>
        <p className="text-neutral-500 text-xs mt-1">Módulo BASF · MVP</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {linksVisibles.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-emerald-600/15 text-emerald-400"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {esAdmin && (
          <div className="mt-6 border-t border-neutral-800 pt-4">
            <p className="px-3 text-xs uppercase tracking-wide text-neutral-500">Configuración</p>
            <Link
              href="/configuracion/usuarios"
              className={`mt-2 block rounded-lg px-3 py-2 text-sm transition ${
                pathname === "/configuracion/usuarios"
                  ? "bg-emerald-600/15 text-emerald-400"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`}
            >
              Administración de Usuarios
            </Link>
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <p className="text-sm text-neutral-300">{nombre}</p>
        <p className="text-xs text-neutral-500 mb-3">{rol}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-neutral-500 hover:text-neutral-300"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
