// src/app/api/admin/usuarios/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).nivelAcceso !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    include: { permisos: true },
  });

  return NextResponse.json(
    usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rolFuncional: u.rolFuncional,
      nivelAcceso: u.nivelAcceso,
      activo: u.activo,
      permisos: u.permisos,
    }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).nivelAcceso !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { nombre, email, password, rolFuncional, nivelAcceso, permisos } = body;

  if (!nombre || !email || !password || !rolFuncional || !nivelAcceso) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevo = await prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash,
      rolFuncional,
      nivelAcceso,
      creadoPorId: (session.user as any).id,
      // Si es USUARIO, guardamos su matriz de permisos por modulo.
      // Si es ADMIN, no hace falta (tiene acceso total igual).
      permisos:
        nivelAcceso === "USUARIO" && Array.isArray(permisos)
          ? {
              create: permisos.map((p: { modulo: string; nivel: string }) => ({
                modulo: p.modulo as any,
                nivel: p.nivel as any,
              })),
            }
          : undefined,
    },
    include: { permisos: true },
  });

  return NextResponse.json({ id: nuevo.id }, { status: 201 });
}
