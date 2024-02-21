import { NextResponse } from "next/server";

export async function POST(request) {
  const dataReceived = await request.json();
  console.log(dataReceived);
  return NextResponse.json({
    dataReceived,
  });
}
