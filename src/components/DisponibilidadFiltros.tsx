"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Option = { id: string; label: string };

export default function DisponibilidadFiltros({
  plantas,
  fechaActual,
  plantaActual,
}: {
  plantas: Option[];
  fechaActual: string;
  plantaActual: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function actualizar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) {
      params.set(clave, valor);
    } else {
      params.delete(clave);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hayFiltros = Boolean(fechaActual || plantaActual);

  return (
    <div className="flex items-end gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
      <div>
        <label className="block text-xs text-neutral-500 mb-1">Fecha</label>
        <input
          type="date"
          defaultValue={fechaActual}
          onChange={(e) => actualizar("fecha", e.target.value)}
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-neutral-500 mb-1">Planta</label>
        <select
          defaultValue={plantaActual}
          onChange={(e) => actualizar("plantaId", e.target.value)}
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white text-sm"
        >
          <option value="">Todas</option>
          {plantas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      {hayFiltros && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-neutral-500 hover:text-neutral-300 pb-2"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
