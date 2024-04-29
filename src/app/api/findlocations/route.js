import { NextResponse } from "next/server";
import { client, db } from "@/db";

export async function GET(req) {
  /**
   *    Here we will be writing a query to get the coordinates of the workers and owners for displaying in the map
   */
  const ownerLocations =
    await client`select ownername,phonenumber,ST_AsGeoJSON(scplace),noworkersreq from owners_duplicate`;
  const workerLocations =
    await client`select workername,phonenumber,ST_AsGeoJSON(scplace) from workers`;
  const headLocations =
    await client`select name,ST_AsGeoJSON(scplace),noofworkers from head`;

  return NextResponse.json({
    ownerLocations,
    workerLocations,
    headLocations,
  });
}
export const dynamic = "force-dynamic";
