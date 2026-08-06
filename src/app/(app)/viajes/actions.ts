"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import type { EstadoViaje } from "@prisma/client";

export async function crearViaje(formData: FormData) {
  const fecha = formData.get("fecha") as string;
  const plantaId = formData.get("plantaId") as string;
  const citacion = (formData.get("citacion") as string) || null;
  const numeroViaje = (formData.get("numeroViaje") as string) || null;

  if (!fecha || !plantaId) {
    throw new Error("Fecha y planta son obligatorios");
  }

  await prisma.viaje.create({
    data: {
      fecha: new Date(fecha),
      plantaId,
      citacion,
      numeroViaje,
      estado: "PRECARGA",
    },
  });
  revalidatePath("/viajes");
}

export async function asignarViaje(id: string, formData: FormData) {
  const unidadId = formData.get("unidadId") as string;
  const choferId = formData.get("choferId") as string;

  if (!unidadId || !choferId) {
    throw new Error("Elegí unidad y chofer");
  }

  const session = await auth();
  const usuarioId = (session?.user as any)?.id as string | undefined;

  await prisma.viaje.update({
    where: { id },
    data: {
      unidadId,
      choferId,
      estado: "ASIGNADO",
      asignadoPorId: usuarioId ?? null,
    },
  });
  revalidatePath("/viajes");
}

export async function actualizarViaje(id: string, formData: FormData) {
  const fecha = formData.get("fecha") as string;
  const plantaId = formData.get("plantaId") as string;
  const citacion = (formData.get("citacion") as string) || null;
  const numeroViaje = (formData.get("numeroViaje") as string) || null;

  if (!fecha || !plantaId) {
    throw new Error("Fecha y planta son obligatorios");
  }

  await prisma.viaje.update({
    where: { id },
    data: {
      fecha: new Date(fecha),
      plantaId,
      citacion,
      numeroViaje,
    },
  });
  revalidatePath("/viajes");
}

export async function eliminarViaje(id: string) {
  await prisma.viaje.delete({ where: { id } });
  revalidatePath("/viajes");
}

export async function cambiarEstadoViaje(id: string, estado: EstadoViaje) {
  const viaje = await prisma.viaje.findUnique({ where: { id } });
  if (!viaje) throw new Error("Viaje no encontrado");

  // No se puede avanzar de estado sin unidad y chofer asignados
  if (estado !== "PRECARGA" && (!viaje.unidadId || !viaje.choferId)) {
    throw new Error("Asigná unidad y chofer antes de avanzar el estado");
  }

  await prisma.viaje.update({ where: { id }, data: { estado } });
  revalidatePath("/viajes");
}
