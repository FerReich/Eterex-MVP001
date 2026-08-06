import { prisma } from "@/lib/prisma";

export default async function CierreFacturacionPage() {
  const rendicionesSinCodigo = await prisma.rendicion.findMany({
    where: { codigoRendicionId: null, status: { in: ["RENDIDO_SIN_OK", "RENDIDO_CON_ADICIONAL"] } },
    include: { viaje: { include: { planta: true } } },
    orderBy: { createdAt: "asc" },
  });

  const codigos = await prisma.codigoRendicion.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { planta: true, rendiciones: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Cierre de viajes para facturación</h1>
        <p className="text-neutral-500 text-sm">
          Agrupá rendiciones por planta (10 a 20 HR) para generar el código y enviar a AGA.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-neutral-300">
            Rendidos sin código asignado ({rendicionesSinCodigo.length})
          </h2>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Generar código de rendición
          </button>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
              <tr>
                <th className="text-left font-medium px-4 py-3"></th>
                <th className="text-left font-medium px-4 py-3">Planta</th>
                <th className="text-left font-medium px-4 py-3">Remitos</th>
                <th className="text-left font-medium px-4 py-3">Cliente a facturar</th>
              </tr>
            </thead>
            <tbody>
              {rendicionesSinCodigo.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">
                    No hay rendiciones pendientes de código.
                  </td>
                </tr>
              )}
              {rendicionesSinCodigo.map((r) => (
                <tr key={r.id} className="border-b border-neutral-800/60 text-neutral-300">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-neutral-700" />
                  </td>
                  <td className="px-4 py-3">{r.viaje.planta.nombre}</td>
                  <td className="px-4 py-3">{r.nroRemitos}</td>
                  <td className="px-4 py-3">{r.clienteFacturar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-neutral-300 mb-3">Códigos de rendición generados</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Código</th>
                <th className="text-left font-medium px-4 py-3">Planta</th>
                <th className="text-left font-medium px-4 py-3">HR agrupadas</th>
                <th className="text-left font-medium px-4 py-3">Enviado a AGA</th>
              </tr>
            </thead>
            <tbody>
              {codigos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">
                    Todavía no se generaron códigos de rendición.
                  </td>
                </tr>
              )}
              {codigos.map((c) => (
                <tr key={c.id} className="border-b border-neutral-800/60 text-neutral-300">
                  <td className="px-4 py-3 font-mono">{c.codigo}</td>
                  <td className="px-4 py-3">{c.planta.nombre}</td>
                  <td className="px-4 py-3">{c.rendiciones.length}</td>
                  <td className="px-4 py-3">
                    {c.fechaEnvioAga ? c.fechaEnvioAga.toLocaleDateString("es-AR") : "Pendiente"}
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
