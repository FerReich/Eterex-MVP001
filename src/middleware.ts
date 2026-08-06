// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { moduloDeRuta, nivelEnModulo } from "@/lib/permisos";

const WRITE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Rutas publicas
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  const user = req.auth!.user as any;
  const nivelAcceso = user.nivelAcceso as "ADMIN" | "USUARIO";
  const permisos = user.permisos ?? {};

  // Configuracion / administracion de usuarios: solo ADMIN
  if (pathname.startsWith("/configuracion") || pathname.startsWith("/api/admin")) {
    if (nivelAcceso !== "ADMIN") {
      return NextResponse.redirect(new URL("/panel", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Resto de modulos: chequeo de nivel de permiso
  const modulo = moduloDeRuta(pathname);
  if (modulo) {
    const nivel = nivelEnModulo(nivelAcceso, permisos, modulo);

    if (nivel === "SIN_ACCESO") {
      return NextResponse.redirect(new URL("/panel", req.nextUrl.origin));
    }

    if (nivel === "LECTURA" && WRITE_METHODS.includes(req.method)) {
      return NextResponse.json(
        { error: "No tenés permiso de escritura en este módulo." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
