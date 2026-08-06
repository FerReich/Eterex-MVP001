"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Panel" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/viajes", label: "Viajes / Asignación" },
  { href: "/planning", label: "Planning" },
  { href: "/rendiciones", label: "Rendiciones" },
  { href: "/cierre-facturacion", label: "Cierre facturación" },
];

export default function Sidebar({ nombre, rol }: { nombre: string; rol: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r border-neutral-800 min-h-screen flex flex-col">
      <div className="p-5 border-b border-neutral-800">
        <p className="text-white font-semibold text-sm">eTerex Distribución</p>
        <p className="text-neutral-500 text-xs mt-1">Módulo BASF · MVP</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
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
// Pegar esto dentro de tu Sidebar.tsx existente.
// Asume que ya tenés acceso a la sesión (useSession de next-auth/react) dentro del componente.
//
// import { useSession } from "next-auth/react";
// const { data: session } = useSession();
// const esAdmin = (session?.user as any)?.nivelAcceso === "ADMIN";
//
// Y en el JSX, junto a los demás links del sidebar:

/*
{esAdmin && (
  <div className="mt-6 border-t border-neutral-800 pt-4">
    <p className="px-3 text-xs uppercase tracking-wide text-neutral-500">Configuración</p>
    <Link
      href="/configuracion/usuarios"
      className="mt-2 block rounded px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
    >
      Administración de Usuarios
    </Link>
  </div>
)}
*/
