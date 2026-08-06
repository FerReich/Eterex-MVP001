import { prisma } from "@/lib/prisma";
import ViajeForm from "@/components/ViajeForm";
import ViajesFiltros from "@/components/ViajesFiltros";
import ViajeAsignarModal from "@/components/ViajeAsignarModal";
import ViajeEstadoSelect from "@/components/ViajeEstadoSelect";
import ViajeRowActions from "@/components/ViajeRowActions";

export default async function ViajesPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string; plantaId?: string; estado?: string }>;
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
  if (params.plantaId) where.plantaId = params.plantaId;
  if (params.estado) where.estado = params.estado;

  const viajes = await prisma.viaje.findMany({
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
          <h1 className="text-xl font-semibold text-white mb-1">Viajes / Asignación</h1>
          <p className="text-neutral-500 text-sm">
            Cargas recibidas del cliente. Asigná unidad y chofer para cada viaje.
          </p>
        </div>
        <ViajeForm plantas={plantasOptions} />
      </div>

      <ViajesFiltros
        plantas={plantasOptions}
        fechaActual={params.fecha ?? ""}
        plantaActual={params.plantaId ?? ""}
        estadoActual={params.estado ?? ""}
      />

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mt-4">
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
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {viajes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-600">
                  No hay viajes para este filtro.
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
                  <ViajeEstadoSelect id={v.id} estado={v.estado} asignado={!!v.unidadId} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {v.estado === "PRECARGA" && (
                      <ViajeAsignarModal
                        viajeId={v.id}
                        unidades={unidadesOptions}
                        choferes={choferesOptions}
                      />
                    )}
                    <ViajeRowActions
                      viaje={{
                        id: v.id,
                        fecha: v.fecha.toISOString().slice(0, 10),
                        plantaId: v.plantaId,
                        citacion: v.citacion ?? "",
                        numeroViaje: v.numeroViaje ?? "",
                      }}
                      plantas={plantasOptions}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
