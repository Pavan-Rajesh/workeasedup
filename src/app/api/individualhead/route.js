import { client } from "@/db";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // console.log(session);
  const { id, email } = session.user;
  const data = await request.json();
  const ratingGiven =
    await client`select giveRatingToWholeWorkersUnderHeadUtility(${data.rating},${data.headid},${id})`;
  return NextResponse.json({ ok: "ok" });
}
