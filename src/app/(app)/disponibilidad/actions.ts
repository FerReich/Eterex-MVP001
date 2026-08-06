"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { EstadoDisponibilidad } from "@prisma/client";

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

export async function actualizarDisponibilidad(id: string, formData: FormData) {
  const fecha = formData.get("fecha") as string;
  const plantaId = formData.get("plantaId") as string;
  const unidadId = formData.get("unidadId") as string;
  const choferId = formData.get("choferId") as string;
  const horario = formData.get("horario") as string;

  if (!fecha || !plantaId || !unidadId || !choferId || !horario) {
    throw new Error("Todos los campos son obligatorios");
  }

  await prisma.disponibilidad.update({
    where: { id },
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

export async function eliminarDisponibilidad(id: string) {
  await prisma.disponibilidad.delete({ where: { id } });
  revalidatePath("/disponibilidad");
}

export async function cambiarEstadoDisponibilidad(id: string, estado: EstadoDisponibilidad) {
  await prisma.disponibilidad.update({
    where: { id },
    data: { estado },
  });
  revalidatePath("/disponibilidad");
}
