import { client } from "@/db";
import { NextResponse } from "next/server";
export async function POST(request) {
  const body = await request.json();
  const headData =
    await client`select name,aadhar,phone from users where id=${body.headid}`;
  console.log(headData);
  return NextResponse.json({ headData });
}
export const dynamic = "force-dynamic";
