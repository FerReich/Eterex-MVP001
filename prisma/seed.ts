import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("eterex2026", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@eterex.com" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@eterex.com",
      passwordHash,
      rol: "ADMIN",
    },
  });

  const plantaVG = await prisma.planta.upsert({
    where: { codigo: "VG" },
    update: {},
    create: { nombre: "Villa Gesell", codigo: "VG" },
  });

  const plantaCA = await prisma.planta.upsert({
    where: { codigo: "CA" },
    update: {},
    create: { nombre: "Campana", codigo: "CA" },
  });

  const unidad1 = await prisma.unidad.upsert({
    where: { patente: "AB123CD" },
    update: {},
    create: { patente: "AB123CD", tipo: "Semirremolque" },
  });

  const chofer1 = await prisma.chofer.upsert({
    where: { id: "seed-chofer-1" },
    update: {},
    create: { id: "seed-chofer-1", nombre: "Juan Pérez", licencia: "A123456" },
  });

  await prisma.disponibilidad.create({
    data: {
      fecha: new Date(),
      plantaId: plantaVG.id,
      unidadId: unidad1.id,
      choferId: chofer1.id,
      horario: "08:00",
      estado: "DISPONIBLE",
    },
  });

  console.log("Seed completo. Login: admin@eterex.com / eterex2026");
  console.log(`Plantas creadas: ${plantaVG.nombre}, ${plantaCA.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
