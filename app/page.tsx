"use client"

import { useState } from "react"

import SamplesSelection from "@/app/(components)/samples-selection"
import TextFrame from "@/app/(components)/text-frame"

export default function IndexPage() {
  const [sampleSelected, setSampleSelected] = useState("")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Captions visualization <br className="hidden sm:inline" />
          Demo App
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Demonstrates two approaches to merge speech-to-text captions with
          original text
        </p>
      </div>
      <hr className="border-b border-slate-200" />

      <div className="flex gap-4">
        <SamplesSelection onClick={setSampleSelected} />
        <TextFrame sampleSelected={sampleSelected} />
      </div>
    </section>
  )
}
