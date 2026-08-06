import { prisma } from "@/lib/prisma";

const estadoColor: Record<string, string> = {
  PRECARGA: "bg-neutral-800 text-neutral-300",
  ASIGNADO: "bg-blue-500/15 text-blue-400",
  INICIADO: "bg-amber-500/15 text-amber-400",
  FINALIZADO: "bg-emerald-500/15 text-emerald-400",
  RENDIDO: "bg-purple-500/15 text-purple-400",
};

export default async function ViajesPage() {
  const viajes = await prisma.viaje.findMany({
    orderBy: { fecha: "desc" },
    take: 50,
    include: { planta: true, unidad: true, chofer: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Viajes / Asignación</h1>
          <p className="text-neutral-500 text-sm">
            Cargas recibidas del cliente. Asigná unidad y chofer para cada viaje.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Importar viajes
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
            <tr>
              <th className="text-left font-medium px-4 py-3">Fecha</th>
              <th className="text-left font-medium px-4 py-3">Planta</th>
              <th className="text-left font-medium px-4 py-3">Nº viaje</th>
              <th className="text-left font-medium px-4 py-3">Citación</th>
              <th className="text-left font-medium px-4 py-3">Unidad</th>
              <th className="text-left font-medium px-4 py-3">Chofer</th>
              <th className="text-left font-medium px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {viajes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-600">
                  Todavía no hay viajes cargados.
                </td>
              </tr>
            )}
            {viajes.map((v) => (
              <tr key={v.id} className="border-b border-neutral-800/60 text-neutral-300">
                <td className="px-4 py-3">{v.fecha.toLocaleDateString("es-AR")}</td>
                <td className="px-4 py-3">{v.planta.nombre}</td>
                <td className="px-4 py-3">{v.numeroViaje ?? "—"}</td>
                <td className="px-4 py-3">{v.citacion ?? "—"}</td>
                <td className="px-4 py-3">{v.unidad?.patente ?? "sin asignar"}</td>
                <td className="px-4 py-3">{v.chofer?.nombre ?? "sin asignar"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${estadoColor[v.estado]}`}
                  >
                    {v.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
