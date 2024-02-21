import { NextRequest, NextResponse } from "next/server";
import { client } from "@/db";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const userData = await request.json();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
  const { id, email } = session.user;
  console.log(id, email);
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
