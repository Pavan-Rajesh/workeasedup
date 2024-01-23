/**
 * For giving work to others
 *
 *
 * */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { client } from "@/db";
export async function POST(request) {
  const ownerData = await request.json();

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { id, email } = session.user;
  const { latitude, longitude } = ownerData.coords;
  const { phoneNumber } = ownerData;

  /**
   *  Here If a new worker mentioned a work then we will be calculating if there are any wokers near to that workers
   *  and store it in the result array
   *
   */

  /**
   *  Finding Workers near to owner and the and we have to limit the number of workers to the requirement of workers and order by the date of registration of workers and limit them to the required number of workers
   *
   */
  const results = await db.execute(sql`select * from workers where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(${latitude},${longitude}),4326),
	                  300000)`);

  /**
   *   if there are  workers near to owner then we will form the array of workers and remove them from the workers table    *   and push it into the workers table
   *
   *
   */

  if (results.length > 0) {
    let myuuidArr = [];
    for (let i = 0; i < results.length; i++) {
      myuuidArr.push(results[i].userid);
    }

    // await db.execute(sql`insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
    //             ST_MakePoint(
    //                 ${latitude},${longitude}
    //             ),
    //             4326)::geometry,ARRAY[${myuuidArr.join(",")}]::text[],${
    //   ownerData.startDate
    // },${ownerData.endDate})`);
    await client`insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
                ST_MakePoint(
                    ${latitude},${longitude}
                ),
                4326)::geometry,${myuuidArr},${ownerData.startDate},${ownerData.endDate},2,'carpenter')`;
    console.log(myuuidArr);

    //!!!! caution here we should also include the head id in the table field of owner so the head that is assigned will be known to the owner

    // await client`update owners_duplicate `;
    // await client`insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
    //             ST_MakePoint(
    //                 ${latitude},${longitude}
    //             ),
    //             4326)::geometry,${myuuidArr},${ownerData.startDate},${ownerData.endDate})`;
  } else {
    /**
     *  else is executed if there are no workers near him
     */
    await db.execute(sql`insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype) values (${id}::uuid,${email}::character varying(26),${phoneNumber}::character varying(10),ST_SetSRID(
                ST_MakePoint(
                    ${latitude},${longitude}
                ),
                4326)::geometry,null,${ownerData.startDate},${ownerData.endDate},2,'carpenter')`);
  }
  return NextResponse.json({ message: "This Worked", success: true });
}

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

/**
 * the owner will be giving the rating out of 10 at last while paying to him then we will be removing the person from the
 * array the rating for the workers will be an average of the rating given by the owners and will be stored in a separate
 * table
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/**
 *  creating webhook and insert -> post request
    sendingjson data no of workers emails and owner email s and check if the number of workers are full filled and send  emails
 * 
 * 
 * 
 * 
 */
