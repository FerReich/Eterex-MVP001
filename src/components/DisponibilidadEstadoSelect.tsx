"use client";

import { useState, useTransition } from "react";
import { cambiarEstadoDisponibilidad } from "@/app/(app)/disponibilidad/actions";

const ESTADOS = [
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "OFRECIDA", label: "Ofrecida" },
  { value: "ASIGNADA", label: "Asignada" },
] as const;

const COLOR: Record<string, string> = {
  DISPONIBLE: "bg-neutral-800 text-neutral-300",
  OFRECIDA: "bg-amber-500/20 text-amber-400",
  ASIGNADA: "bg-emerald-500/20 text-emerald-400",
};

export default function DisponibilidadEstadoSelect({
  id,
  estado,
}: {
  id: string;
  estado: string;
}) {
  const [valor, setValor] = useState(estado);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={valor}
      disabled={pending}
      onChange={(e) => {
        const nuevo = e.target.value;
        setValor(nuevo);
        startTransition(async () => {
          await cambiarEstadoDisponibilidad(id, nuevo as any);
        });
      }}
      className={`text-xs rounded-full px-2 py-1 border-0 outline-none cursor-pointer disabled:opacity-50 ${
        COLOR[valor] ?? "bg-neutral-800 text-neutral-300"
      }`}
    >
      {ESTADOS.map((e) => (
        <option key={e.value} value={e.value} className="bg-neutral-900 text-neutral-200">
          {e.label}
        </option>
      ))}
    </select>
  );
}
