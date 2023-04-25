import Parser from "srt-parser-2"

const parser = new Parser().fromSrt
export type SRT = ReturnType<typeof parser>
