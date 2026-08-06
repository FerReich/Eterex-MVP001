"use client";

import { useState, useRef } from "react";
import { actualizarViaje, eliminarViaje } from "@/app/(app)/viajes/actions";

type Option = { id: string; label: string };
type ViajeData = {
  id: string;
  fecha: string;
  plantaId: string;
  citacion: string;
  numeroViaje: string;
};

export default function ViajeRowActions({
  viaje,
  plantas,
}: {
  viaje: ViajeData;
  plantas: Option[];
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
      await actualizarViaje(viaje.id, formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setPending(false);
    }
  }

  async function handleEliminar() {
    if (!confirm("¿Eliminar este viaje?")) return;
    setEliminando(true);
    try {
      await eliminarViaje(viaje.id);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="text-neutral-400 hover:text-neutral-100 text-sm">
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
            <h2 className="text-white text-lg font-semibold mb-4">Editar viaje</h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  required
                  defaultValue={viaje.fecha}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Planta</label>
                <select
                  name="plantaId"
                  required
                  defaultValue={viaje.plantaId}
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
                <label className="block text-sm text-neutral-300 mb-1">Nº de viaje</label>
                <input
                  type="text"
                  name="numeroViaje"
                  defaultValue={viaje.numeroViaje}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Citación</label>
                <input
                  type="text"
                  name="citacion"
                  defaultValue={viaje.citacion}
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
