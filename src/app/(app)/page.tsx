import { prisma } from "@/lib/prisma";

export default async function PanelPage() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [disponiblesHoy, viajesActivos, rendicionesPendientes] = await Promise.all([
    prisma.disponibilidad.count({ where: { fecha: hoy } }),
    prisma.viaje.count({ where: { estado: { in: ["ASIGNADO", "INICIADO"] } } }),
    prisma.rendicion.count({ where: { status: "PENDIENTE" } }),
  ]);

  const cards = [
    { label: "Unidades disponibles hoy", value: disponiblesHoy },
    { label: "Viajes en curso", value: viajesActivos },
    { label: "Rendiciones pendientes", value: rendicionesPendientes },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-white mb-1">Panel</h1>
      <p className="text-neutral-500 text-sm mb-6">Módulo Distribución BASF</p>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <p className="text-neutral-500 text-xs">{c.label}</p>
            <p className="text-white text-3xl font-semibold mt-2">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
