import { prisma } from "@/lib/prisma";

export default async function PlanningPage() {
  const viajes = await prisma.viaje.findMany({
    where: { estado: { in: ["ASIGNADO", "INICIADO"] } },
    orderBy: { fecha: "asc" },
    include: { planta: true, unidad: true, chofer: true },
  });

  const porChofer = new Map<string, typeof viajes>();
  for (const v of viajes) {
    const key = v.chofer?.nombre ?? "Sin asignar";
    if (!porChofer.has(key)) porChofer.set(key, []);
    porChofer.get(key)!.push(v);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-white mb-1">Planning</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Operaciones activas agrupadas por chofer. Es lo que ve el equipo para el día siguiente.
      </p>

      <div className="space-y-4">
        {porChofer.size === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-600 text-sm">
            No hay viajes asignados por el momento.
          </div>
        )}
        {Array.from(porChofer.entries()).map(([chofer, vs]) => (
          <div
            key={chofer}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <p className="text-white text-sm font-medium">{chofer}</p>
              <span className="text-xs text-neutral-500">{vs.length} viaje(s)</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {vs.map((v) => (
                  <tr key={v.id} className="border-b border-neutral-800/60 last:border-0 text-neutral-300">
                    <td className="px-4 py-2 w-28">{v.fecha.toLocaleDateString("es-AR")}</td>
                    <td className="px-4 py-2">{v.planta.nombre}</td>
                    <td className="px-4 py-2">{v.unidad?.patente ?? "—"}</td>
                    <td className="px-4 py-2 text-neutral-500">{v.citacion ?? "sin citación"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
