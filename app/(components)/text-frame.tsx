"use client"

import React, { useEffect, useState } from "react"
import Parser from "srt-parser-2"

import { samples } from "@/lib/samples"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const parser = new Parser()

const TextFrame = ({ sampleSelected }: { sampleSelected: string }) => {
  return sampleSelected ? (
    <CaptionsView sampleSelected={sampleSelected} />
  ) : (
    <CustomText />
  )
}

export default TextFrame

const CaptionsView = ({ sampleSelected }: { sampleSelected: string }) => {
  const selected =
    samples.find((sample) => sample.id === sampleSelected)?.text || ""
  const [text, setText] = useState(selected)
  const [srt, setSrt] = useState<ReturnType<typeof parser.fromSrt>>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    fetch("/srt/sample1.srt")
      .then((res) => res.text())
      .then((text) => {
        const srt = parser.fromSrt(text)
        console.log("srt", srt)
        setSrt(srt)
      })
  }, [sampleSelected])

  const currentFragment = srt.find((fragment) => {
    return fragment.startSeconds <= time && fragment.endSeconds >= time
  })

  return (
    <div className="">
      <div>
        <audio
          className="w-full rounded-md"
          controls
          src="/audio/sample1.mp3"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const audio = e.target as HTMLAudioElement
            setTime(audio.currentTime)
          }}
        ></audio>
      </div>
      <p className="text-sm text-slate-600">
        {isPlaying ? "Playing" : "Paused"} at {formatTime(time)}
      </p>
      <div className="mt-4 rounded-lg bg-slate-100 p-4 shadow">
        {srt.map((fragment) => {
          return (
            <>
              {" "}
              <span
                key={fragment.id}
                className={cn(
                  fragment.id === currentFragment?.id &&
                    "bg-slate-200 font-bold"
                )}
              >
                {fragment.text}
              </span>{" "}
            </>
          )
        })}
      </div>
    </div>
  )
}

const CustomText = ({}) => {
  const [text, setText] = useState("")

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="message">Text to process</Label>
      <Textarea
        disabled
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here."
        className="min-h-[270px]"
        id="message"
      />
      <div className="mt-4 flex justify-end">
        <Button disabled className="">
          Process
        </Button>
      </div>
    </div>
  )
}
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  // @ts-expect-error 123123
  minutes = minutes >= 10 ? minutes : "0" + minutes
  seconds = Math.floor(seconds % 60)
  seconds = seconds >= 10 ? seconds : "0" + seconds
  return minutes + ":" + seconds
}
