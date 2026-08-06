// src/app/api/admin/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).nivelAcceso !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const { nombre, rolFuncional, nivelAcceso, activo, password, permisos } = body;

  const data: any = {};
  if (nombre !== undefined) data.nombre = nombre;
  if (rolFuncional !== undefined) data.rolFuncional = rolFuncional;
  if (nivelAcceso !== undefined) data.nivelAcceso = nivelAcceso;
  if (activo !== undefined) data.activo = activo;
  if (password) data.passwordHash = await bcrypt.hash(password, 10);

  await prisma.usuario.update({ where: { id }, data });

  // Si mandaron permisos nuevos, reemplazamos la matriz completa (mas simple que hacer diff)
  if (Array.isArray(permisos)) {
    await prisma.permisoModulo.deleteMany({ where: { usuarioId: id } });
    if (permisos.length > 0) {
      await prisma.permisoModulo.createMany({
        data: permisos.map((p: { modulo: string; nivel: string }) => ({
          usuarioId: id,
          modulo: p.modulo as any,
          nivel: p.nivel as any,
        })),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).nivelAcceso !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;

  // Baja logica, no hard delete: evita romper el historial de viajes asignados por ese usuario.
  await prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });

  return NextResponse.json({ ok: true });
}
