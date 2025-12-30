import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL = "tolga+test2@guzellikuzmani.online";

async function main() {
  const updated = await prisma.user.update({
    where: { email: EMAIL },
    data: { adminApproved: true },
    select: { id: true, email: true, adminApproved: true, role: true },
  });

  console.log("OK:", updated);
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
