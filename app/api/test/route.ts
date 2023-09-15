import { beries } from "@/lib/beries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  let data;

  if (name) {
    data = beries.filter(berry =>
      berry.name.toLowerCase().includes(name?.toLocaleLowerCase() ?? "")
    );
  } else {
    data = beries;
  }

  return NextResponse.json({
    data: data.slice(0,10)
  })
}