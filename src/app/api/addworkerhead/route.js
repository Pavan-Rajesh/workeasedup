import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { client } from "@/db";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const workerdata = await request.json();
  // console.log(session.user.id);
  // console.log(workerdata);
  //   { example response
  //     workerid: "d5fc617c-b543-4d47-aab3-f03fe82a84b2";
  //   }
  const workerArray = [workerdata.workerid];
  //here we are updating the array of workers under the head so that all the workers will be under him
  //here we should also write the trigger so that the number of workers in the array of head will be counted
  const query =
    await client`update head set workers = ARRAY_APPEND(workers,${workerdata.workerid}),noofworkers=noofworkers+1  where id=${id};`;
  const query2 =
    await client`update workers set head=${id} where userid=${workerdata.workerid}`;
  // console.log(query);
  return NextResponse.json({
    everything: "ok",
  });
}

/** complete logic  for selecting the workers under the heads and taking remianing from the indivdiual workers */

// CREATE OR REPLACE FUNCTION head_add(required_workers int,latitude float,longitude float,id_owner uuid)
// -- here we will be taking the required number of workers and the id of the owner respectively
// --   required_workers id_owner
// RETURNS void AS $$
// DECLARE
//      head_workers int;
//      required_workers int;
//      head_id uuid;
//      workers_from_head text[];
//      individual_workers_array text[];
//      workers_count int;
//      available_workers int;
//      diffworkers int;

// BEGIN
//     -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
//     -- here we have owner id
//     -- Assign a value to the variable
//     head_id := null;

//     select id into head_id from head where required_workers <= head.noofworkers order by dateofregister limit 1;

//     select noofworkers into available_workers from head where id = head_id;
//     diffworkers := required_workers - available_workers;

//     if head_id is not null then
//             if diffworkers=0 then
//               -- here we will be selecting all the workers from the heads
//               select workers into workers_from_head from head where id=head_id;
//               update owners_duplicate set workers=workers_from_head where userid = id_owner;
//             else
//               select workers into workers_from_head from head where id=head_id;
//               update owners_duplicate set workers=workers_from_head where userid = id_owner;

//               select ARRAY(select userid from workers  where ST_DWithin(
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) order by dateofregister limit diffworkers ) into individual_workers_array;

//               update owners_duplicate set workers = ARRAY_APPEND(workers,individual_workers_array);

//               -- here we will be selecting some of the members from the heads and some of the members from the individual groups
//             end if;
//     else

//             select ARRAY(select userid from workers  where ST_DWithin(
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) order by dateofregister limit diffworkers ) into individual_workers_array;

//               update owners_duplicate set workers = ARRAY_APPEND(workers,individual_workers_array);

//             -- here we should write login that we will be selecting the workers individually

//     end if;

//     -- Your logic using the variable goes here
//     -- For example, you can use it in a SELECT statement
//     -- SELECT * FROM your_table WHERE some_column = your_variable_name;

//     -- Or perform other operations using the variable

// END;
// $$ LANGUAGE plpgsql;
