"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearDisponibilidad(formData: FormData) {
  const fecha = formData.get("fecha") as string;
  const plantaId = formData.get("plantaId") as string;
  const unidadId = formData.get("unidadId") as string;
  const choferId = formData.get("choferId") as string;
  const horario = formData.get("horario") as string;

  if (!fecha || !plantaId || !unidadId || !choferId || !horario) {
    throw new Error("Todos los campos son obligatorios");
  }

  await prisma.disponibilidad.create({
    data: {
      fecha: new Date(fecha),
      plantaId,
      unidadId,
      choferId,
      horario,
    },
  });

  revalidatePath("/disponibilidad");
}
