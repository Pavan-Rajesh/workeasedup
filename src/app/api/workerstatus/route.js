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
  const [{ owner }] =
    await client`select owner from workers where userid=${id}`;
  if (owner) {
    const ownerData = await client`select * from users where id=${owner}`;
    return NextResponse.json({
      ownerData,
    });
  } else {
    return NextResponse.json({
      owner: "no owner assigned",
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
    const acceptWork = await client`select workerAccept(${id},${ownerid})`;
  } else {
    const rejectwork = await client`select workerReject(${id},${ownerid})`;
  }
  return NextResponse.json({
    ok: "ok",
  });
}
