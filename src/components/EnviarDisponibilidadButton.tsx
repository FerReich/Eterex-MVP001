"use client";

type Item = { planta: string; unidad: string; chofer: string; horario: string };

export default function EnviarDisponibilidadButton({
  fecha,
  disponibilidades,
}: {
  fecha?: string;
  disponibilidades: Item[];
}) {
  function enviar() {
    const fechaLabel = fecha
      ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
      : new Date().toLocaleDateString("es-AR");

    const cuerpo = disponibilidades.length
      ? disponibilidades
          .map((d) => `- ${d.planta}: ${d.unidad} / ${d.chofer} / ${d.horario}hs`)
          .join("\n")
      : "Sin unidades disponibles cargadas para este filtro.";

    const asunto = encodeURIComponent(`Disponibilidad ${fechaLabel} - eTerex Distribución`);
    const mensaje = encodeURIComponent(
      `Buenos días,\n\nEsta es la disponibilidad de flota para el ${fechaLabel}:\n\n${cuerpo}\n\nSaludos,\neTerex Distribución`
    );

    window.location.href = `mailto:?subject=${asunto}&body=${mensaje}`;
  }

  return (
    <button
      onClick={enviar}
      className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
    >
      Enviar por mail
    </button>
  );
}
