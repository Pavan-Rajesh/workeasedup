import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const dataReceived = await request.json();
  console.log(dataReceived);
  return NextResponse.json({
    dataReceived,
  });
}
