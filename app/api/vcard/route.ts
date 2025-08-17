// app/api/vcard/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Sanchez Jr;O;;;",         // Last;First;Middle;Prefix;Suffix (adjust)
    "FN:O. Sanchez Jr",
    "TITLE:Security Engineer",
    "EMAIL;type=INTERNET;type=WORK;pref:me@heyosj.com",
    "URL:https://heyosj.com",
    "NOTE:secops/cloud • tooling & detections",
    "END:VCARD",
  ].join("\r\n");

  return new NextResponse(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="osanchezjr.vcf"',
    },
  });
}
