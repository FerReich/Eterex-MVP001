import { prisma } from "@/lib/prisma";
import DisponibilidadForm from "@/components/DisponibilidadForm";
import DisponibilidadFiltros from "@/components/DisponibilidadFiltros";
import DisponibilidadEstadoSelect from "@/components/DisponibilidadEstadoSelect";
import DisponibilidadRowActions from "@/components/DisponibilidadRowActions";
import EnviarDisponibilidadButton from "@/components/EnviarDisponibilidadButton";

export default async function DisponibilidadPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string; plantaId?: string }>;
}) {
  const params = await searchParams;

  const [plantas, unidades, choferes] = await Promise.all([
    prisma.planta.findMany({ orderBy: { nombre: "asc" } }),
    prisma.unidad.findMany({ where: { activa: true }, orderBy: { patente: "asc" } }),
    prisma.chofer.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
  ]);

  const where: any = {};
  if (params.fecha) {
    const inicio = new Date(`${params.fecha}T00:00:00`);
    const fin = new Date(`${params.fecha}T23:59:59`);
    where.fecha = { gte: inicio, lte: fin };
  }
  if (params.plantaId) {
    where.plantaId = params.plantaId;
  }

  const disponibilidades = await prisma.disponibilidad.findMany({
    where,
    orderBy: { fecha: "desc" },
    take: 50,
    include: { planta: true, unidad: true, chofer: true },
  });

  const plantasOptions = plantas.map((p) => ({ id: p.id, label: p.nombre }));
  const unidadesOptions = unidades.map((u) => ({ id: u.id, label: `${u.patente} · ${u.tipo}` }));
  const choferesOptions = choferes.map((c) => ({ id: c.id, label: c.nombre }));

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
        <div className="flex items-center gap-3">
          <EnviarDisponibilidadButton
            fecha={params.fecha}
            disponibilidades={disponibilidades.map((d) => ({
              planta: d.planta.nombre,
              unidad: d.unidad.patente,
              chofer: d.chofer.nombre,
              horario: d.horario,
            }))}
          />
          <DisponibilidadForm
            plantas={plantasOptions}
            unidades={unidadesOptions}
            choferes={choferesOptions}
          />
        </div>
      </div>

      <DisponibilidadFiltros
        plantas={plantasOptions}
        fechaActual={params.fecha ?? ""}
        plantaActual={params.plantaId ?? ""}
      />

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-500">
            <tr>
              <th className="text-left font-medium px-4 py-3">Fecha</th>
              <th className="text-left font-medium px-4 py-3">Planta</th>
              <th className="text-left font-medium px-4 py-3">Unidad</th>
              <th className="text-left font-medium px-4 py-3">Chofer</th>
              <th className="text-left font-medium px-4 py-3">Horario</th>
              <th className="text-left font-medium px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {disponibilidades.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-600">
                  No hay disponibilidad cargada para este filtro.
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
                  <DisponibilidadEstadoSelect id={d.id} estado={d.estado} />
                </td>
                <td className="px-4 py-3">
                  <DisponibilidadRowActions
                    disponibilidad={{
                      id: d.id,
                      fecha: d.fecha.toISOString().slice(0, 10),
                      plantaId: d.plantaId,
                      unidadId: d.unidadId,
                      choferId: d.choferId,
                      horario: d.horario,
                    }}
                    plantas={plantasOptions}
                    unidades={unidadesOptions}
                    choferes={choferesOptions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
