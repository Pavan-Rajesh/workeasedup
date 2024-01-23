import { usePathname } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { client } from "@/db";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // console.log(session);
  const { id, email } = session.user;
  const ratingByOwnerData = await request.json();
  console.log(ratingByOwnerData);

  // await client`DO $$
  // DECLARE
  //     worksuptonow integer := 0;
  //     overallratingcalculated float :=0;
  //     worksuptonowsep integer :=0;
  // BEGIN
  //     select worksdone into worksuptonow from sepworkers where uuid=${ratingByOwnerData.workerid}::uuid;
  //     UPDATE sepworkers SET ratings=ARRAY_APPEND(ratings,${ratingByOwnerData.workerRating}) WHERE uuid = ${ratingByOwnerData.workerid}::uuid;
  //     worksuptonow := worksuptonow+1;
  //     SELECT SUM(value)
  //     INTO overallratingcalculated
  //     FROM unnest((SELECT ratings FROM sepworkers WHERE uuid = ${ratingByOwnerData.workerid}::uuid)) AS value;
  //     RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
  //     update sepworkers set overallrating = overallratingcalculated / worksuptonow,worksdone=worksuptonow;
  // END $$;
  // `.catch((err) => {
  //   console.log(err);
  // });

  // here we are implementing procedure for inserting and updating the rating of the workers

  // it is created as follows and it is runned in terminal for creating the function

  /**
   *  -- create or replace function giveRating(userId uuid,rating float) returns void as $$

-- DECLARE
--       worksuptonow integer := 0;
--       overallratingcalculated float :=0;
--       worksuptonowsep integer :=0;
--   BEGIN
--       select worksdone into worksuptonow from sepworkers where uuid=userId::uuid;
--       UPDATE sepworkers SET ratings=ARRAY_APPEND(ratings,rating) WHERE uuid = userId::uuid;
--       worksuptonow := worksuptonow+1;
--       SELECT SUM(value)
--       INTO overallratingcalculated
--       FROM unnest((SELECT ratings FROM sepworkers WHERE uuid = userId::uuid)) AS value;
--       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
--       update sepworkers set overallrating = overallratingcalculated / worksuptonow,worksdone=worksuptonow;
--   END

-- $$ language plpgsql
   * 
   * 
   * 
   * 
   * 
   */

  await client`select giveRating(${ratingByOwnerData.workerid},${ratingByOwnerData.workerRating});`;

  /**
   *  example response
   * { workerRating: 4, workerid: '9d42ff1c-55e5-4e65-95cb-c110ae2d7196' }
   * now we will be inserting this into the sepworkers table and the workers table will be rounded to average
   *    so we will now create or replace the entity in the workers table
   *  and then we will be removing the worker when the owner gives him the rating
   *
   *
   *
   */

  //   create table persons (id int,rating int,primary key(id));

  // insert into persons (id,rating) values (1,4) on CONFLICT(id) do update set rating=persons.rating;

  // https://dbfiddle.uk/6odswEJ4

  // console.log(ratingByOwnerData);
  // { workerRating: 4, workerid: '63e581bc-c3d8-4aa2-b503-e01b24a344ce' }
  // now we have to remove the worker from workers table and owners array

  //removing the workers ids from the workers array in owners table
  const resultver = await db
    .execute(
      sql`update owners_duplicate set workers = ARRAY_REMOVE(workers,${ratingByOwnerData.workerid}) where userid = ${id}`
    )
    .catch((err) => {
      console.log(err);
    });

  // updating the status of the workers in sepworkers table
  const updateStatus = await db
    .execute(
      sql`update sepworkers set isworking=FALSE where uuid=${ratingByOwnerData.workerid}`
    )
    .catch((err) => {
      console.log(err);
    });

  // deleting the worker in the worker table to be done

  const deleteWorker = await db
    .execute(
      sql`delete from workers where userid=${ratingByOwnerData.workerid}`
    )
    .catch((err) => {
      console.log(err);
    });

  /**
   * 
   * 
   * DO $$
DECLARE
    worksuptonow numeric := 0; -- Replace with the new value you want to insert
    ratingdup float := 1;     -- Replace with the ID of the row you want to update
BEGIN
    -- Calculate the average of the present value and the newly inserted value
    select worksdone into worksuptonow from test where id=1;
    select rating into ratingdup from test where id=1;
    worksuptonow := worksuptonow+1;
    UPDATE test SET rating = (rating + 4) / worksuptonow,worksdone=worksuptonow WHERE id = 1;

END $$;

   * 
   * 
   * 
   * 
   */

  return NextResponse.json({
    rating: "successful",
  });
}
