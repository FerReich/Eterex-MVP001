// src/app/configuracion/usuarios/page.tsx
"use client";

import { useEffect, useState } from "react";
import UsuarioForm from "@/components/UsuarioForm";
import { MODULOS } from "@/lib/permisos";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rolFuncional: "PLANIFICADOR" | "RENDICION";
  nivelAcceso: "ADMIN" | "USUARIO";
  activo: boolean;
  permisos: { modulo: string; nivel: string }[];
};

export default function AdministracionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [creando, setCreando] = useState(false);

  async function cargar() {
    setCargando(true);
    const res = await fetch("/api/admin/usuarios");
    const data = await res.json();
    setUsuarios(data);
    setCargando(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function toggleActivo(u: Usuario) {
    await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !u.activo }),
    });
    cargar();
  }

  function resumenPermisos(u: Usuario) {
    if (u.nivelAcceso === "ADMIN") return "Acceso total";
    if (u.permisos.length === 0) return "Sin permisos asignados";
    return u.permisos
      .filter((p) => p.nivel !== "SIN_ACCESO")
      .map((p) => {
        const label = MODULOS.find((m) => m.valor === p.modulo)?.label ?? p.modulo;
        const nivel = p.nivel === "ESCRITURA" ? "R/W" : "Lectura";
        return `${label} (${nivel})`;
      })
      .join(", ") || "Sin permisos asignados";
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-100">Administración de Usuarios</h1>
          <p className="text-sm text-neutral-400">
            Creá administradores y usuarios, y definí su nivel de acceso por módulo.
          </p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol funcional</th>
              <th className="px-4 py-3 text-left">Nivel de acceso</th>
              <th className="px-4 py-3 text-left">Permisos</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando &&
              usuarios.map((u) => (
                <tr key={u.id} className="border-t border-neutral-800/60 text-neutral-300">
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.rolFuncional}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.nivelAcceso === "ADMIN"
                          ? "rounded bg-amber-500/20 px-2 py-0.5 text-amber-400"
                          : "rounded bg-sky-500/20 px-2 py-0.5 text-sky-400"
                      }
                    >
                      {u.nivelAcceso === "ADMIN" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">{resumenPermisos(u)}</td>
                  <td className="px-4 py-3">
                    {u.activo ? (
                      <span className="text-emerald-400">Activo</span>
                    ) : (
                      <span className="text-neutral-500">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => setEditando(u)}
                      className="text-neutral-400 hover:text-neutral-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleActivo(u)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      {u.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {(creando || editando) && (
        <UsuarioForm
          usuario={editando}
          onClose={() => {
            setCreando(false);
            setEditando(null);
          }}
          onSaved={() => {
            setCreando(false);
            setEditando(null);
            cargar();
          }}
        />
      )}
    </div>
  );
}
