import { prisma } from "@/lib/prisma";

const statusColor: Record<string, string> = {
  PENDIENTE: "bg-neutral-800 text-neutral-300",
  RENDIDO_SIN_OK: "bg-amber-500/15 text-amber-400",
  RENDIDO_CON_ADICIONAL: "bg-blue-500/15 text-blue-400",
  OK_FACTURAR: "bg-emerald-500/15 text-emerald-400",
};

export default async function RendicionesPage() {
  const viajesPendientes = await prisma.viaje.findMany({
    where: { estado: "FINALIZADO", rendicion: null },
    include: { planta: true, unidad: true, chofer: true },
    orderBy: { fecha: "asc" },
  });

  const rendiciones = await prisma.rendicion.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: { viaje: { include: { planta: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Rendiciones</h1>
        <p className="text-neutral-500 text-sm">
          Viajes finalizados pendientes de rendición física y documentación cargada.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-neutral-300 mb-3">
          Viajes pendientes de rendición ({viajesPendientes.length})
        </h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Fecha</th>
                <th className="text-left font-medium px-4 py-3">Planta</th>
                <th className="text-left font-medium px-4 py-3">Nº viaje</th>
                <th className="text-left font-medium px-4 py-3">Chofer</th>
                <th className="text-left font-medium px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {viajesPendientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-600">
                    No hay viajes pendientes de rendición.
                  </td>
                </tr>
              )}
              {viajesPendientes.map((v) => (
                <tr key={v.id} className="border-b border-neutral-800/60 text-neutral-300">
                  <td className="px-4 py-3">{v.fecha.toLocaleDateString("es-AR")}</td>
                  <td className="px-4 py-3">{v.planta.nombre}</td>
                  <td className="px-4 py-3">{v.numeroViaje ?? "—"}</td>
                  <td className="px-4 py-3">{v.chofer?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-emerald-400 text-xs hover:underline">
                      Cargar rendición
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-neutral-300 mb-3">Rendiciones cargadas</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Planta</th>
                <th className="text-left font-medium px-4 py-3">Remitos</th>
                <th className="text-left font-medium px-4 py-3">Cliente a facturar</th>
                <th className="text-left font-medium px-4 py-3">Adicional</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rendiciones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-600">
                    Todavía no hay rendiciones cargadas.
                  </td>
                </tr>
              )}
              {rendiciones.map((r) => (
                <tr key={r.id} className="border-b border-neutral-800/60 text-neutral-300">
                  <td className="px-4 py-3">{r.viaje.planta.nombre}</td>
                  <td className="px-4 py-3">{r.nroRemitos}</td>
                  <td className="px-4 py-3">{r.clienteFacturar}</td>
                  <td className="px-4 py-3">{r.adicional ? "Sí" : "No"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs rounded-full px-2 py-1 ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
