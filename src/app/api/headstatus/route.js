import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { client } from "@/db";
export async function GET(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;

  const [{ owner }] = await client`select owner from head where id=${id}`;

  if (owner == "notassigned") {
    return NextResponse.json({
      owner: {
        assigned: false,
      },
    });
  } else {
    const ownerData =
      await client`select name,address,aadhar,phone,id from users where id=${owner}`;
    return NextResponse.json({
      owner: {
        assigned: true,
        ownerData,
      },
    });
  }
}

export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const { ownerid, status } = await request.json();
  if (status) {
    const acceptWork = await client`select acceptHead(${id},${ownerid})`;
  } else {
    const rejectwork = await client`select rejectHead(${id},${ownerid})`;
  }
  return NextResponse.json({
    ok: "ok",
  });
}
