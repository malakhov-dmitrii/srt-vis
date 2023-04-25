import { NextResponse } from "next/server"
import { saveVoiceOverAsFile } from "@/voiceover/voiceover"

export const POST = async (req: Request) => {
  const body = await req.json()

  if (!body.text) {
    return NextResponse.json({ message: "No text provided" }, { status: 400 })
  }

  const res = await saveVoiceOverAsFile(body.text)

  return NextResponse.json(res)
}
