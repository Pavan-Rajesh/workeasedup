/**
 *  in this the owner will be getting the list of workers which are assigned to him and at last he will be
 *    giving rating to them
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sql } from "drizzle-orm";
import { client, db } from "@/db";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // console.log(session);
  const { id, email } = session.user;

  const ownerWorkers = await db.execute(
    sql`select workers from owners_duplicate where userid=${id}`
  );
  // console.log(ownerWorkers);

  // console.log(ownerWorkers);
  // const workersAssigned = ownerWorkers[0].workers;

  /**
   *  fetching workers details with their respective ids
   *  example array workersArray - [ '9d42ff1c-55e5-4e65-95cb-c110ae2d7196' ]
   *
   *  !!! this should be changed to sep workers after usage for giving the rating
   *
   *  this is only working for the single worker and not working for the more than other workers
   */
  // console.log(id);

  //   const workersDetails = await client`
  // select * from workers where userid in (select unnest(array(select workers from owners_duplicate where userid=${id})))`;

  // console.log(workersDetails);

  /**
   *  example result of workersDetails = Result(1) [
  {
    workername: 'pavanrajesh365@gmail.com',
    userid: '9d42ff1c-55e5-4e65-95cb-c110ae2d7196'
  }
]
   *
   */

  /**
   *  next the individual worker needs to taken from the workers array and needs to be given rating
   *  so we will be sending the worker id and their respective user name to the front end
   *
   */

  return NextResponse.json({
    ownerWorkers,
    message: "This Worked",
    success: true,
  });
}
