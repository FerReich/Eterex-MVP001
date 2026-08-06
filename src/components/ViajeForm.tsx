"use client";

import { useState, useRef } from "react";
import { crearViaje } from "@/app/(app)/viajes/actions";

type Option = { id: string; label: string };

export default function ViajeForm({ plantas }: { plantas: Option[] }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      await crearViaje(formData);
      setOpen(false);
      formRef.current?.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
      >
        + Nuevo viaje
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white text-lg font-semibold mb-1">Nuevo viaje</h2>
            <p className="text-neutral-500 text-xs mb-4">
              Se carga en Precarga. Asigná unidad y chofer después, desde la tabla.
            </p>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  required
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Planta</label>
                <select
                  name="plantaId"
                  required
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {plantas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Nº de viaje (opcional)</label>
                <input
                  type="text"
                  name="numeroViaje"
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Citación (opcional)</label>
                <input
                  type="text"
                  name="citacion"
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
