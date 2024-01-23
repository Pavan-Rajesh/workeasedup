import { client } from "@/db";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;

  const headData = await request.json();

  const registerhead =
    await client`insert into head(id,name,scplace) values (${id},${headData.headname},ST_SetSRID(
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry)`;

  return NextResponse.json({ message: "successfully the is registered" });
}
