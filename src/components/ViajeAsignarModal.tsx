"use client";

import { useState, useRef } from "react";
import { asignarViaje } from "@/app/(app)/viajes/actions";

type Option = { id: string; label: string };

export default function ViajeAsignarModal({
  viajeId,
  unidades,
  choferes,
}: {
  viajeId: string;
  unidades: Option[];
  choferes: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      await asignarViaje(viajeId, formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al asignar");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
      >
        Asignar
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white text-lg font-semibold mb-4">Asignar unidad y chofer</h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Unidad</label>
                <select
                  name="unidadId"
                  required
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  <option value="">Seleccionar...</option>
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
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {choferes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
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
                  {pending ? "Asignando..." : "Asignar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
