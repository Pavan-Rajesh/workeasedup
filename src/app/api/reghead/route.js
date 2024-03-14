import { client } from "@/db";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;

  const headData = await request.json();
  console.log(headData);
  const registerhead =
    await client`insert into head(id,name,scplace,worktype) values (${id},${headData.headname},ST_SetSRID(
                ST_MakePoint(${headData.scplace.latitude},${headData.scplace.longitude}),
                4326)::geometry,${headData.worktype})`;

  const query =
    await db.execute(sql`select ST_AsGeoJSON(scplace),userid,noworkersreq,worktype from owners_duplicate where ST_DWithin(
          	owners_duplicate.scplace,
	              ST_SetSRID(ST_MakePoint(${headData.scplace.latitude},${headData.scplace.longitude}),4326),
                  300000) and worktype=${headData.worktype} and noworkersreq>0 order by dateofregistration limit 1`);

  if (query.length > 0) {
    const coordinates = JSON.parse(query[0].st_asgeojson);
    const [{ userid, noworkersreq, worktype }] = query;
    // console.log(userid, noworkersreq, worktype);

    const updateTables =
      await db.execute(sql`select your_function_name_ver3(${noworkersreq},${coordinates.coordinates[0]},${coordinates.coordinates[1]},${userid},${worktype});
     `);
  }

  return NextResponse.json({ message: "successfully the is registered" });
}
