import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { client } from "@/db";

export async function POST(request) {
  const workerData = await request.json();
  // console.log(workerData);
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { id, email } = session.user;
  const { latitude, longitude } = workerData.coords;
  const { phoneNumber, typeofwork } = workerData;

  // here we will be checking if the worker is already been registered
  const checkifRegistered = await db.execute(
    sql`select * from workers where userid=${id}`
  );

  // so if the worker is already registered we  will be sending a response that you are already registered
  if (checkifRegistered.length > 0) {
    return NextResponse.json({
      message: "there exists already",
      success: true,
    });
  }

  await db.execute(sql`insert into workers (userid,workername,phonenumber,scplace,worktype) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
                ST_MakePoint(
                    ${latitude},${longitude}
                ),
                4326)::geometry,${typeofwork})`);

  const query =
    await db.execute(sql`select ST_AsGeoJSON(scplace),userid,noworkersreq,worktype from owners_duplicate where ST_DWithin(
          	owners_duplicate.scplace,
	              ST_SetSRID(ST_MakePoint(${latitude},${longitude}),4326),
                  300000) and worktype=${typeofwork} and noworkersreq>0 order by dateofregistration limit 1`);

  if (query.length > 0) {
    const coordinates = JSON.parse(query[0].st_asgeojson);
    const [{ userid, noworkersreq, worktype }] = query;
    // console.log(userid, noworkersreq, worktype);

    const updateTables =
      await db.execute(sql`select your_function_name_ver3(${noworkersreq},${coordinates.coordinates[0]},${coordinates.coordinates[1]},${userid},${worktype});
     `);
  }

  return NextResponse.json({ message: "This Worked", success: true });
}

// [
//   {
//     ownername: 'pavan@123',
//     phonenumber: '9034534534',
//     scplace: '0101000020E610000070DFB42AD3AF3140FC51D499FBCD5440',
//     userid: '4adf414f-94a4-4c44-99c7-8347842ef966',
//     workers: null,
//     startdate: 2024-02-06T00:00:00.000Z,
//     enddate: 2024-02-21T00:00:00.000Z,
//     dateofregistration: 2024-02-03T04:46:33.213Z,
//     noworkersreq: '1',
//     worktype: 'carpenter',
//     filled: false
//   }
// ]

// // after we will be selecting the owners in which the owner is near him
// const results =
//   await db.execute(sql`select userid from owners_duplicate where ST_DWithin(
//           	owners_duplicate.scplace,
// 	              ST_SetSRID(ST_MakePoint(${latitude},${longitude}),4326),
//                   300000) and worktype=${typeofwork} and noworkersreq>0 order by dateofregistration limit 1`);

// // console.log(results); //Result(1) [ { userid: 'adea4c83-80c2-40dd-9045-d086a9621ca7' } ] <-- appending to the owner array

// // if the owner is not registered we will be inserting into the workers table should be modified at front end
// await db.execute(
//   sql`insert into workers (userid,workername,phonenumber,scplace,owner,worktype) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
//               ST_MakePoint(
//                   ${latitude},${longitude}
//               ),
//               4326)::geometry,${results[0].userid},${typeofwork})`
// );

// // inserting into the owners array if there is owner is near to him
// if (results.length > 0) {
//   const attachedUser = await db.execute(
//     // here the query should be modified that is we should update the row where it matches the owner_row that means we have to select the owner by id and we have to update the number of workers required also
//     sql`update owners_duplicate set workers = ARRAY_APPEND(workers,${id}) where userid=${results[0].userid}`

//     //**************          TODO                              */
//     // here we have to send emails or messages to the workers who got the work
//   );
//   console.log(attachedUser);
//   //  update contacts set phones = ARRAY_APPEND(phones,'9039583823') where id=2;
// }

// // console.log(results);
// // here the result will be displaying the owners which are near to him
// // and we have to select the owners based on the time of registration
// const initialArray = [0];
// const sepworkersRes =
//   await client`insert into sepworkers (uuid,name,worktype,isworking,worksdone,ratings,overallrating) values (${id},${email},${typeofwork},TRUE,${0},${initialArray},${0}) on conflict (uuid) do update set isworking=TRUE`;

// // console.log(sepworkersRes);
// //here we are inserting into separate workers table and his status and his rating or update the users status to working

// example response

//{
//   name: 'dfs',
//   phoneNumber: 'df',
//   coords: { latitude: 17.6868159, longitude: 83.2184815 }
// }

//example session response

// {
//   expires_at: 1697034898,
//   expires_in: 2757,
//   token_type: 'bearer',
//   access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IlEzeGtnWWpDTGZjU0daSDYiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk3MDM0ODk4LCJpYXQiOjE2OTcwMzEyOTgsImlzcyI6Imh0dHBzOi8vcGh5Y294bXZmYmhoenNvbmtnYnEuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjAwNTM5NzI5LTBhMGMtNDdjYS05OWEzLWU5ZDk2MGM4OTVkOSIsImVtYWlsIjoicGF2YW5yYWplc2gzNjVAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2OTcwMjc3MTF9XSwic2Vzc2lvbl9pZCI6ImI1NzY0OTUzLTQyN2MtNGQ0MS1hMGI5LWIyOTliMjA4ZjM5ZiJ9.DfEryinuDGWC22DQv8kFxZf697Lo5UbkVeJy3jqymEo',
//   refresh_token: 'EjPnJmvb_rxRN73wPG8XnQ',
//   provider_token: null,
//   provider_refresh_token: null,
//   user: {
//     id: '00539729-0a0c-47ca-99a3-e9d960c895d9',
//     factors: null,
//     aud: 'authenticated',
//     iat: 1697031298,
//     iss: 'https://phycoxmvfbhhzsonkgbq.supabase.co/auth/v1',
//     email: 'pavanrajesh365@gmail.com',
//     phone: '',
//     app_metadata: { provider: 'email', providers: [Array] },
//     user_metadata: {},
//     role: 'authenticated',
//     aal: 'aal1',
//     amr: [ [Object] ],
//     session_id: 'b5764953-427c-4d41-a0b9-b299b208f39f'
//   }
// }

// insert into restaurants (id,name,location) values (23,'pavanplease', ST_SetSRID(
//             ST_MakePoint(
//                 5,5
//             ),
//             4326
//         ))

// query that has to be written here

// ST_AsGeoJSON(geog);

// needs to be debugged

// DO $$
// DECLARE
//     worksuptonow numeric := 0; -- Replace with the new value you want to insert
//     ratingdup float := 1;     -- Replace with the ID of the row you want to update
//     overallratingcalculated float :=1
// BEGIN
//     -- Calculate the average of the present value and the newly inserted value
//     select worksdone into worksuptonow from test where id=1;
//     select rating into ratingdup from test where id=1;
//     worksuptonow := worksuptonow+1;
//     SELECT SUM(value) into overallratingcalculated FROM unnest(test.ratings) AS value WHERE id = 1;
//     UPDATE test SET rating = (rating + 4) / worksuptonow,worksdone=worksuptonow,ratings=ARRAY_APPEND(ratings,4),overallrating = overallrating + 4 /worksuptonow WHERE id = 1;

// END $$;
