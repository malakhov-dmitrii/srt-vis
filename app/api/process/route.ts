import { NextResponse } from "next/server"
import redis from "@/voiceover/redis"
import { saveVoiceOverAsFile } from "@/voiceover/voiceover"
import { uniqueId } from "lodash"
import { v4 } from "uuid"

export const POST = async (req: Request) => {
  const body = await req.json()

  if (!body.text) {
    return NextResponse.json({ message: "No text provided" }, { status: 400 })
  }

  const jobId = `job_${v4()}`
  await redis.set(jobId, JSON.stringify({ status: "started" }))

  const res = await saveVoiceOverAsFile(body.text)

  return NextResponse.json(res)
}

export const GET = async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  console.log({ id })
  return NextResponse.json({ id })
}
