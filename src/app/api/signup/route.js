import { NextRequest, NextResponse } from "next/server";
import { client } from "@/db";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(request) {
  const userData = await request.json();
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const { name, aadhar, date, address, phonenumber, useremail } = userData;
  //   console.log(name, aadhar, date, address, phonenumber, useremail, id, email);
  const insertedValues =
    await client`insert into users (id, name, address, dob, aadhar, phone) values (
    ${id},
    ${name},
    ${address},
    ${date},
    ${aadhar},
    ${phonenumber}
  )`;
  return NextResponse.json({
    ok: "ok",
  });
}
