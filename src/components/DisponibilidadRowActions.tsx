"use client";

import { useState, useRef } from "react";
import {
  actualizarDisponibilidad,
  eliminarDisponibilidad,
} from "@/app/(app)/disponibilidad/actions";

type Option = { id: string; label: string };
type DisponibilidadData = {
  id: string;
  fecha: string; // yyyy-mm-dd
  plantaId: string;
  unidadId: string;
  choferId: string;
  horario: string;
};

export default function DisponibilidadRowActions({
  disponibilidad,
  plantas,
  unidades,
  choferes,
}: {
  disponibilidad: DisponibilidadData;
  plantas: Option[];
  unidades: Option[];
  choferes: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      await actualizarDisponibilidad(disponibilidad.id, formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setPending(false);
    }
  }

  async function handleEliminar() {
    if (!confirm("¿Eliminar este registro de disponibilidad?")) return;
    setEliminando(true);
    try {
      await eliminarDisponibilidad(disponibilidad.id);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-neutral-400 hover:text-neutral-100 text-sm"
        >
          Editar
        </button>
        <button
          onClick={handleEliminar}
          disabled={eliminando}
          className="text-neutral-400 hover:text-red-400 text-sm disabled:opacity-50"
        >
          {eliminando ? "..." : "Eliminar"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white text-lg font-semibold mb-4">Editar disponibilidad</h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  required
                  defaultValue={disponibilidad.fecha}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Planta</label>
                <select
                  name="plantaId"
                  required
                  defaultValue={disponibilidad.plantaId}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  {plantas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Unidad</label>
                <select
                  name="unidadId"
                  required
                  defaultValue={disponibilidad.unidadId}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Chofer</label>
                <select
                  name="choferId"
                  required
                  defaultValue={disponibilidad.choferId}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  {choferes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Horario</label>
                <input
                  type="time"
                  name="horario"
                  required
                  defaultValue={disponibilidad.horario}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  {pending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
