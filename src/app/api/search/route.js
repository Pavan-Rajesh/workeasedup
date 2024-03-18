import { NextResponse } from "next/server";
import { client } from "@/db";
export async function POST(request) {
  const data = await request.json();
  console.log(data);
  const [userData] =
    await client`select name,address,phone,aadhar from users where id=${data.data}`;

  return NextResponse.json(userData);
}
