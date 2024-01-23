// import { PrismaClient } from "prisma/prisma-client";
// export async function GET() {
//   const prisma = new PrismaClient();
//   const Myuser = await prisma.user.findFirst({
//     where: {
//       email: "pavanrajesh365@gmail.com",
//     },
//   });
//   return new Response(JSON.stringify(Myuser));
// }

export async function GET(request) {
  return new Response(JSON.stringify({ pavan: "rajesh" }));
}

export async function POST(request) {
  const body = await request.json();
  console.log(body);
  return new Response("ok");
}
