import { prisma } from "@/lib/prisma";

export default async function DisponibilidadPage() {
  const disponibilidades = await prisma.disponibilidad.findMany({
    orderBy: { fecha: "desc" },
    take: 50,
    include: { planta: true, unidad: true, chofer: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Disponibilidad</h1>
          <p className="text-neutral-500 text-sm">
            Flota disponible por fecha, planta, unidad y chofer. Se envía al cliente antes de
            las 10hs.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Cargar disponibilidad
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
            <tr>
              <th className="text-left font-medium px-4 py-3">Fecha</th>
              <th className="text-left font-medium px-4 py-3">Planta</th>
              <th className="text-left font-medium px-4 py-3">Unidad</th>
              <th className="text-left font-medium px-4 py-3">Chofer</th>
              <th className="text-left font-medium px-4 py-3">Horario</th>
              <th className="text-left font-medium px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {disponibilidades.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-600">
                  Todavía no hay disponibilidad cargada.
                </td>
              </tr>
            )}
            {disponibilidades.map((d) => (
              <tr key={d.id} className="border-b border-neutral-800/60 text-neutral-300">
                <td className="px-4 py-3">{d.fecha.toLocaleDateString("es-AR")}</td>
                <td className="px-4 py-3">{d.planta.nombre}</td>
                <td className="px-4 py-3">{d.unidad.patente}</td>
                <td className="px-4 py-3">{d.chofer.nombre}</td>
                <td className="px-4 py-3">{d.horario}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-neutral-800 text-neutral-300 rounded-full px-2 py-1">
                    {d.estado}
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
