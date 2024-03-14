export async function POST(request) {
  const data = await request.json();
  console.log(data);
  return NextResponse.json({
    ok: "ok",
  });
}
export const dynamic = "force-dynamic";
