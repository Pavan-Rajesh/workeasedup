import { client } from "@/db";
import { NextResponse } from "next/server";
export async function GET(request) {
  const [{ count: workers }] = await client`select count(*) from workers`;
  const [{ count: owners }] =
    await client`select count(*) from owners_duplicate`;
  const [{ count: heads }] = await client`select count(*) from head`;
  console.log(owners, workers, heads);
  return NextResponse.json({
    ownersCount: owners,
    workerCount: workers,
    headCount: heads,
  });
}
