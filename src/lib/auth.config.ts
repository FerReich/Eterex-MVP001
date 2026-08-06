// src/lib/auth.config.ts
// Version liviana: SIN providers, SIN Prisma, SIN bcrypt.
// Esto es lo que corre en el Edge Runtime (middleware). Si le agregás algo pesado
// a este archivo, el middleware va a volver a pasarse del limite de 1 MB.
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [], // los providers reales se agregan solo en auth.ts (runtime Node)
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).rolFuncional = token.rolFuncional;
        (session.user as any).nivelAcceso = token.nivelAcceso;
        (session.user as any).permisos = token.permisos;
      }
      return session;
    },
  },
};
