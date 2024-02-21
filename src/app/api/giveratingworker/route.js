export async function POST(request) {
  const data = await request.json();
  console.log(data);
  return NextResponse.json({
    ok: "ok",
  });
}
