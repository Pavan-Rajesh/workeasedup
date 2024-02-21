import { client } from "@/db";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request) {
  const data = await request.json();
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { id, email } = session.user;
  const updateRating =
    await client`select separateRatingToEveryOne(${data.workerid},${data.rating},'normalworker',${id})`;
  return NextResponse.json({
    everything: "ok",
  });
}
