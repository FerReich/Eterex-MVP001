// src/components/UsuarioForm.tsx
"use client";

import { useState } from "react";
import { MODULOS, type Modulo, type NivelPermiso } from "@/lib/permisos";

type UsuarioEdit = {
  id: string;
  nombre: string;
  email: string;
  rolFuncional: "PLANIFICADOR" | "RENDICION";
  nivelAcceso: "ADMIN" | "USUARIO";
  permisos: { modulo: string; nivel: string }[];
} | null;

export default function UsuarioForm({
  usuario,
  onClose,
  onSaved,
}: {
  usuario: UsuarioEdit;
  onClose: () => void;
  onSaved: () => void;
}) {
  const esEdicion = !!usuario;

  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [password, setPassword] = useState("");
  const [rolFuncional, setRolFuncional] = useState(usuario?.rolFuncional ?? "PLANIFICADOR");
  const [nivelAcceso, setNivelAcceso] = useState(usuario?.nivelAcceso ?? "USUARIO");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const permisosIniciales: Record<Modulo, NivelPermiso> = MODULOS.reduce((acc, m) => {
    const existente = usuario?.permisos.find((p) => p.modulo === m.valor);
    acc[m.valor] = (existente?.nivel as NivelPermiso) ?? "SIN_ACCESO";
    return acc;
  }, {} as Record<Modulo, NivelPermiso>);

  const [permisos, setPermisos] = useState(permisosIniciales);

  async function guardar() {
    setError(null);

    if (!nombre || !email || (!esEdicion && !password)) {
      setError("Completá nombre, email y contraseña.");
      return;
    }

    setGuardando(true);

    const permisosArray = MODULOS.map((m) => ({ modulo: m.valor, nivel: permisos[m.valor] }));

    const body: any = { nombre, rolFuncional, nivelAcceso, permisos: permisosArray };
    if (!esEdicion) {
      body.email = email;
      body.password = password;
    } else if (password) {
      body.password = password;
    }

    const url = esEdicion ? `/api/admin/usuarios/${usuario!.id}` : "/api/admin/usuarios";
    const method = esEdicion ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setGuardando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error al guardar.");
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-100">
          {esEdicion ? "Editar usuario" : "Nuevo usuario"}
        </h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-sm text-neutral-400">
            Nombre
            <input
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          <label className="col-span-2 text-sm text-neutral-400">
            Email
            <input
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 disabled:opacity-50"
              value={email}
              disabled={esEdicion}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="col-span-2 text-sm text-neutral-400">
            {esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
            <input
              type="password"
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="text-sm text-neutral-400">
            Rol funcional
            <select
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
              value={rolFuncional}
              onChange={(e) => setRolFuncional(e.target.value as any)}
            >
              <option value="PLANIFICADOR">Planificador</option>
              <option value="RENDICION">Rendición</option>
            </select>
          </label>

          <label className="text-sm text-neutral-400">
            Nivel de acceso
            <select
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
              value={nivelAcceso}
              onChange={(e) => setNivelAcceso(e.target.value as any)}
            >
              <option value="USUARIO">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
        </div>

        {nivelAcceso === "USUARIO" && (
          <div className="space-y-2 rounded border border-neutral-800 p-3">
            <p className="text-sm text-neutral-400">Permisos por módulo</p>
            {MODULOS.map((m) => (
              <div key={m.valor} className="flex items-center justify-between text-sm">
                <span className="text-neutral-300">{m.label}</span>
                <select
                  className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100"
                  value={permisos[m.valor]}
                  onChange={(e) =>
                    setPermisos((prev) => ({ ...prev, [m.valor]: e.target.value as NivelPermiso }))
                  }
                >
                  <option value="SIN_ACCESO">Sin acceso</option>
                  <option value="LECTURA">Solo lectura</option>
                  <option value="ESCRITURA">Lectura y escritura</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {nivelAcceso === "ADMIN" && (
          <p className="text-xs text-neutral-500">
            Los administradores tienen acceso total a todos los módulos y pueden crear otros usuarios.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="rounded px-4 py-2 text-sm text-neutral-400 hover:text-neutral-100">
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
