import { NextRequest, NextResponse } from "next/server";
import { client } from "@/db";
export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  console.log(id); // here id will be only logged out
  const user =
    await client`select workername,phonenumber from workers where userid=${id}`;
  console.log(user);

  return NextResponse.json({
    data: user,
  });
}
export const dynamic = "force-dynamic";
