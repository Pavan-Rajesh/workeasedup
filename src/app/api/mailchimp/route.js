import { NextResponse } from "next/server";
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "c724e2fa63603d91bd853762df777b13",
  server: "us17",
});
export async function POST(request) {
  const { email } = await request.json();
  const response = await client.lists.addListMember("701079c3ce", {
    email_address: email,
    status: "subscribed",
  });
  if (response.id) {
    return NextResponse.json({
      subscribe: true,
    });
  } else {
    return NextResponse.json({
      error: true,
    });
  }
}
