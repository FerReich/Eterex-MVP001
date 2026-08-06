// src/lib/auth.ts
// Version completa: se usa en API routes, server components, etc (runtime Node, no Edge).
// Aca SI se puede usar Prisma y bcrypt.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { PermisosMap } from "@/lib/permisos";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
          include: { permisos: true },
        });

        if (!usuario || !usuario.activo) return null;

        const passwordOk = await bcrypt.compare(
          credentials.password as string,
          usuario.passwordHash
        );
        if (!passwordOk) return null;

        const permisos: PermisosMap = {};
        for (const p of usuario.permisos) {
          permisos[p.modulo] = p.nivel;
        }

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          rolFuncional: usuario.rolFuncional,
          nivelAcceso: usuario.nivelAcceso,
          permisos,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.rolFuncional = (user as any).rolFuncional;
        token.nivelAcceso = (user as any).nivelAcceso;
        token.permisos = (user as any).permisos;
      }
      return token;
    },
  },
});
