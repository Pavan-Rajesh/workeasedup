import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { client } from "@/db";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { id, email } = session.user;

  const { role } = await request.json();
  if (role == "owner") {
    const ownerdata =
      await client`select ownername,phonenumber,startdate,enddate,noworkersreq,worktype,accepted,pending from owners_duplicate where userid=${id}`;
    //     const workersdata =
    //       await client`select name from users where id in (select unnest(workers) from owners_duplicate where userid::uuid=${id})`;
    //     const headsData = await client`SELECT name
    // FROM users
    // WHERE id::uuid IN (
    //     SELECT unnest(head)
    //     FROM owners_duplicate
    //     WHERE userid = ${id})`;
    const headIds =
      await client`select head from owners_duplicate where userid::uuid=${id}`;
    const workerIds =
      await client`select workers from owners_duplicate where userid::uuid=${id}`;
    // console.log(ownerdata, workersdata, headsData);
    return NextResponse.json({ ownerdata, workerIds, headIds });
  } else if (role == "worker") {
    const workerdata =
      await client`select workername,worktype,head,owner,status from workers where userid=${id}`;
    // console.log(workerdata);
    return NextResponse.json({ workerdata });
  } else if (role == "head") {
    const headData =
      await client`select worktype,owner,noofworkers,name,status from head where id=${id}`;
    // const workersdata =
    //   await client`select name from users where id in(select unnest(workers) from head where id=${id})`;
    const workerIds = await client`select workers from head where id=${id}`;
    const ownerdata =
      await client`select name from users where id =(select owner from head where id=${id})`;
    // console.log(headData, workersdata, ownerdata);
    return NextResponse.json({ headData, workerIds, ownerdata });
  }
}
