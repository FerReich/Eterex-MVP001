"use client";

import { useState, useTransition } from "react";
import { cambiarEstadoViaje } from "@/app/(app)/viajes/actions";

const ESTADOS = [
  { value: "ASIGNADO", label: "Asignado" },
  { value: "INICIADO", label: "Iniciado" },
  { value: "FINALIZADO", label: "Finalizado" },
] as const;

const COLOR: Record<string, string> = {
  PRECARGA: "bg-neutral-800 text-neutral-300",
  ASIGNADO: "bg-blue-500/15 text-blue-400",
  INICIADO: "bg-amber-500/15 text-amber-400",
  FINALIZADO: "bg-emerald-500/15 text-emerald-400",
  RENDIDO: "bg-purple-500/15 text-purple-400",
};

export default function ViajeEstadoSelect({
  id,
  estado,
  asignado,
}: {
  id: string;
  estado: string;
  asignado: boolean;
}) {
  const [valor, setValor] = useState(estado);
  const [pending, startTransition] = useTransition();

  // Sin unidad/chofer todavia: se muestra como badge fijo, no hay nada para elegir.
  if (!asignado) {
    return <span className={`text-xs rounded-full px-2 py-1 ${COLOR[valor]}`}>{valor}</span>;
  }

  // Rendido lo dispara el modulo de Rendiciones (mas adelante), no se cambia a mano aca.
  if (valor === "RENDIDO") {
    return <span className={`text-xs rounded-full px-2 py-1 ${COLOR[valor]}`}>Rendido</span>;
  }

  return (
    <select
      value={valor}
      disabled={pending}
      onChange={(e) => {
        const nuevo = e.target.value;
        setValor(nuevo);
        startTransition(async () => {
          await cambiarEstadoViaje(id, nuevo as any);
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
