"use client"

import React, { useEffect, useState } from "react"
import { SRT } from "@/types"
import axios from "axios"
import Parser from "srt-parser-2"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const parser = new Parser()

const TextFrame = ({ sampleSelected }: { sampleSelected: string }) => {
  const [srt, setSrt] = useState<SRT>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [audio, setAudio] = useState("/audio/sample1.mp3")

  const handleProcess = async () => {
    setLoading(true)
    axios
      .post("/api/process", { text })
      .then((res) => {
        // console.log(res.data)
        setSrt(res.data.postProcessedSrt ?? res.data.srt)
        setAudio(res.data.audio)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!!sampleSelected) {
      fetch("/srt/sample1.srt")
        .then((res) => res.text())
        .then((text) => {
          const srt = parser.fromSrt(text)
          setSrt(srt)
        })
    }
  }, [sampleSelected])

  const currentFragment = srt.find((fragment) => {
    return fragment.startSeconds <= time && fragment.endSeconds >= time
  })

  return sampleSelected || !!srt.length ? (
    <div className="">
      <div>
        <audio
          className="w-full rounded-md"
          controls
          src={audio}
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

      {!!text.length && (
        <div>
          <h2 className="mt-8 text-lg font-semibold">Original text</h2>
          <div className="mt-4 rounded-lg bg-slate-100 p-4 shadow">{text}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="w-full space-y-2">
      {loading && (
        <div className="my-8 flex w-full flex-col items-center justify-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-lg font-semibold">
            Processing... This may take a while (up to a few minutes). Please do
            not close this page.
          </p>
        </div>
      )}
      <Label htmlFor="message">Text to process</Label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here."
        className="min-h-[270px]"
        id="message"
        disabled={loading}
      />
      <div className="mt-4 flex justify-end">
        <Button
          disabled={loading || !text.trim()}
          className=""
          onClick={handleProcess}
        >
          Process
        </Button>
      </div>
    </div>
  )
}

export default TextFrame

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  // @ts-expect-error 123123
  minutes = minutes >= 10 ? minutes : "0" + minutes
  seconds = Math.floor(seconds % 60)
  seconds = seconds >= 10 ? seconds : "0" + seconds
  return minutes + ":" + seconds
}
