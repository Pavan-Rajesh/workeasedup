import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { client, db } from "@/db";
export async function GET(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // console.log(session);
  const { id, email } = session.user;

  // const data = await request.json();
  // const respondedRating =
  //   await client`select giveRatingToWholeWorkersUnderHead(${data.workerRating}::float, ${id}::text)`;

  const headsData = await client`SELECT name,phone,aadhar,id
FROM users
WHERE id::uuid IN (
    SELECT unnest(head) 
    FROM owners_duplicate
    WHERE userid = ${id}
);`;

  return NextResponse.json({ headsData });
}
