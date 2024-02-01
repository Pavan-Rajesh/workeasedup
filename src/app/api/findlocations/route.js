import { NextResponse } from "next/server";
import { client, db } from "@/db";

export async function GET(req) {
  /**
   *    Here we will be writing a query to get the coordinates of the workers and owners for displaying in the map
   */
  const ownerLocations =
    await client`select ownername,phonenumber,ST_AsGeoJSON(scplace) from owners_duplicate`;
  const workerLocations =
    await client`select ST_AsGeoJSON(scplace) from workers`;

  return NextResponse.json({
    ownerLocations,
    workerLocations,
  });
}
