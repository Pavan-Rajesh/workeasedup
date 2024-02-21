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

// create or replace function giveRatingToWholeWorkersUnderHead(rating float,ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//       workersArray text[];
//       var text;
//       headid text;
//   BEGIN
//       select head into headid from owners_duplicate where userid=ownerid::uuid;
//       select workers into workersArray from head where id=headid::uuid;
//        foreach var in array workersArray loop
//    perform giveRatingToWorker(var,rating,ownerid);

//      update head set workers=ARRAY_REMOVE(workers,var) where id=headid::uuid;
//        --here we are removing the workers identity from array
//   end loop;
//   perform giveRatingToHead(headid,rating,ownerid);

//   END

// $$ language plpgsql;

// -- whole bunch --

// create or replace function separateRatingToEveryOne(workerid text,rating float,type text,ownerid text) returns void as $$
// -- here worker means the head will also be present
// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//     if type='head' then
//       select headworks into worksuptonow from users where id=workerid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=workerid;
//       delete from head where id=workerid::uuid;
//       update owners_duplicate set head=null,ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;

//     else
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       delete from workers where userid=workerid;
//       update owners_duplicate set workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
//       --error is here the ratingsgiven field is being duplicated
//        update owners_duplicate set headworkers=ARRAY_REMOVE(headworkers,workerid) where userid=ownerid::uuid;
//        update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid);
//     end if;
//   END

// $$ language plpgsql;

// create or replace function giveRatingToHead(headid text,rating float,ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select headworks into worksuptonow from users where id=headid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = headid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = headid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=headid;
//       delete from head where id=headid::uuid;
//       update owners_duplicate set head=null where userid=ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,headid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// create or replace function giveRatingToWorker(workerid text,rating float,ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       delete from workers where userid=workerid;
//       update owners_duplicate set workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set headworkers=ARRAY_REMOVE(headworkers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// ---------------------------------------------------------

// 11-02-24
// create
// or replace function giveRatingToWholeWorkersUnderHeadUtility (rating float, head_id text, ownerid text) returns void as $$
// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//       workersArray text[];
//       var text;
//       headid text;
//   BEGIN

//       select workers into workersArray from head where id=head_id::uuid;

//        foreach var in array workersArray loop
//                 perform giveRatingToWorker(var,rating,ownerid);

//      update head set workers=ARRAY_REMOVE(workers,var) where id=head_id::uuid;

//        --here we are removing the workers identity from array
//   end loop;
//   perform giveRatingToHead(head_id,rating,ownerid);

//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToWholeWorkersUnderHead (rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//       headsarray text[];
//       var text;
//       headid text;
//   BEGIN
//       select head into headsarray from owners_duplicate where userid=ownerid::uuid;

//        foreach var in array headsarray loop
//    perform giveRatingToWholeWorkersUnderHeadUtility(rating,var,ownerid);

//        --here we are removing the workers identity from array
//   end loop;

//   END

// $$ language plpgsql;

// -- whole bunch --
// create
// or replace function separateRatingToEveryOne (
//   workerid text,
//   rating float,
//   type
//     text,
//     ownerid text
// ) returns void as $$
// -- here worker means the head will also be present
// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//     if type='head' then
//       select headworks into worksuptonow from users where id=workerid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=workerid;
// --       delete from head where id=workerid::uuid;
// --     update owners_duplicate set head=null,ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;
// UPDATE owners_duplicate
//                 SET
//                 head = (
//                         SELECT array_agg(head_id)
//                         FROM unnest(head) AS head_id
//                         WHERE head_id <> headid::uuid
//                 )
//                 WHERE userid = ownerid::uuid;
//     else
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       --error is here the ratingsgiven field is being duplicated
//        update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid);
//     end if;
//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToHead (headid text, rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select headworks into worksuptonow from users where id=headid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = headid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = headid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=headid;
//       delete from head where id=headid::uuid;
//     UPDATE owners_duplicate
//                 SET
//                 head = (
//                         SELECT array_agg(head_id)
//                         FROM unnest(head) AS head_id
//                         WHERE head_id <> headid::uuid
//                 )
//                 WHERE userid = ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,headid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToWorker (workerid text, rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       delete from workers where userid=workerid;
//       update owners_duplicate set workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set headworkers=ARRAY_REMOVE(headworkers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// -- select
// --   giveRatingToWholeWorkersUnderHead (67, '0996cde2-5eca-447c-858b-8192927f7266');

// create
// or replace function giveRatingToWholeWorkersUnderHeadUtility (rating float, head_id text, ownerid text) returns void as $$
// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//       workersArray text[];
//       var text;
//       headid text;
//   BEGIN

//       select workers into workersArray from head where id=head_id::uuid;

//        foreach var in array workersArray loop
//                 perform giveRatingToWorker(var,rating,ownerid);

//      update head set workers=ARRAY_REMOVE(workers,var) where id=head_id::uuid;

//        --here we are removing the workers identity from array
//   end loop;
//   perform giveRatingToHead(head_id,rating,ownerid);

//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToWholeWorkersUnderHead (rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//       headsarray text[];
//       var text;
//       headid text;
//   BEGIN
//       select head into headsarray from owners_duplicate where userid=ownerid::uuid;

//        foreach var in array headsarray loop
//    perform giveRatingToWholeWorkersUnderHeadUtility(rating,var,ownerid);

//        --here we are removing the workers identity from array
//   end loop;

//   END

// $$ language plpgsql;

// -- whole bunch --
// create
// or replace function separateRatingToEveryOne (
//   workerid text,
//   rating float,
//   type
//     text,
//     ownerid text
// ) returns void as $$
// -- here worker means the head will also be present
// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//     if type='head' then
//       select headworks into worksuptonow from users where id=workerid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=workerid;
// --       delete from head where id=workerid::uuid;
// --     update owners_duplicate set head=null,ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;
// UPDATE owners_duplicate
//                 SET
//                 head = (
//                         SELECT array_agg(head_id)
//                         FROM unnest(head) AS head_id
//                         WHERE head_id <> headid::uuid
//                 )
//                 WHERE userid = ownerid::uuid;
//     else
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       --error is here the ratingsgiven field is being duplicated
//        update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid);
//     end if;
//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToHead (headid text, rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select headworks into worksuptonow from users where id=headid;
//       UPDATE users SET headratings=ARRAY_APPEND(headratings,rating) WHERE id = headid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT headratings FROM users WHERE id = headid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set headrating = overallratingcalculated / worksuptonow,headworks=worksuptonow where id=headid;
//       delete from head where id=headid::uuid;
//     UPDATE owners_duplicate
//                 SET
//                 head = (
//                         SELECT array_agg(head_id)
//                         FROM unnest(head) AS head_id
//                         WHERE head_id <> headid::uuid
//                 )
//                 WHERE userid = ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,headid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// create
// or replace function giveRatingToWorker (workerid text, rating float, ownerid text) returns void as $$

// DECLARE
//       worksuptonow integer := 0;
//       overallratingcalculated float :=0;
//       worksuptonowsep integer :=0;
//   BEGIN
//       select workerworks into worksuptonow from users where id=workerid;
//       UPDATE users SET workerratings=ARRAY_APPEND(workerratings,rating) WHERE id = workerid;
//       worksuptonow := worksuptonow+1;
//       SELECT SUM(value)
//       INTO overallratingcalculated
//       FROM unnest((SELECT workerratings FROM users WHERE id = workerid)) AS value;
//       RAISE NOTICE 'overallratingcalculated is %', overallratingcalculated;
//       update users set workerrating = overallratingcalculated / worksuptonow,workerworks=worksuptonow where id=workerid;
//       delete from workers where userid=workerid;
//       update owners_duplicate set workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set headworkers=ARRAY_REMOVE(headworkers,workerid) where userid=ownerid::uuid;
//       update owners_duplicate set ratingsgiven=ARRAY_APPEND(ratingsgiven,workerid)  where userid=ownerid::uuid;
//   END

// $$ language plpgsql;

// -- select
// --   giveRatingToWholeWorkersUnderHead (67, '0996cde2-5eca-447c-858b-8192927f7266');
