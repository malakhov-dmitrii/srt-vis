import { SRT } from "@/types"
import { getCompletion } from "@/voiceover/openai"
import axios from "axios"
import { uniqBy } from "lodash"
import { ChatCompletionResponseMessage } from "openai"
import Parser from "srt-parser-2"

import { getSrt } from "./captions"

const getVoiceOver = async (text: string) => {
  console.log("Getting voice over")

  const res = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/TxGEqnHWrfWFTfGW9XjX`,
    {
      text,
    },
    {
      headers: {
        "xi-api-key": "f2c02d78de99427616be4a700ca60d5b",
      },
      responseType: "arraybuffer",
    }
  )

  console.log("Got voice over")
  return res.data
}

const prompt = (
  text: string,
  srt: string
) => `I have a .srt file with captions for some audio, and original text. There are some mistakes in .srt file, so I want you to fix it. Take original text, find all errors in srt file and fix them. Output your result as a new .srt file.
You should keep the number of segments, and the length of the segment should can have only small deviations

-----Original text: ------

${text}

----- .srt file content ------

${srt}

------

Now, provide your result
`

const postProcessSrtWithChatGpt = async (source: string, srt: SRT) => {
  const parser = new Parser()
  const chunkSize = 15
  const chunks = [] as SRT[]
  for (let i = 0; i < srt.length; i += chunkSize) {
    const chunk = srt.slice(i, i + chunkSize)

    // console.log(`Chunk ${i}, chunkSize: ${chunkSize}`, chunk)

    chunks.push(chunk)
  }

  // console.log(chunks)

  let count = 0
  const answers = [] as string[]
  for await (const chunk of chunks) {
    console.log(`GPT corrects chunk ${count++}...`)

    const part = parser.toSrt(chunk)
    const messages: ChatCompletionResponseMessage[] = [
      {
        role: "user",
        content: prompt(source, part),
      },
    ]

    const answer = await getCompletion(messages)
    answers.push(answer)
  }

  console.log("Done with GPT")

  const postSrt = parser.fromSrt(answers.join("\n"))
  return uniqBy(postSrt, "id")
}

export const saveVoiceOverAsFile = async (text: string) => {
  const voiceOver = await getVoiceOver(text)

  const file = Buffer.from(voiceOver, "binary")
  console.log("Getting SRT...")

  const srt = await getSrt(file)
  const postProcessedSrt = await postProcessSrtWithChatGpt(text, srt)

  // return audio as base64
  const base64 = Buffer.from(voiceOver).toString("base64")
  const audio = `data:audio/mpeg;base64,${base64}`

  return { srt, postProcessedSrt, audio }
}
