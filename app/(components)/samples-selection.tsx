"use client"

import { samples } from "@/lib/samples"
import { Button } from "@/components/ui/button"

const SamplesSelection = ({
  onClick,
}: {
  onClick: (sample: string) => void
}) => {
  return (
    <div className="flex w-full min-w-fit max-w-xs flex-col space-y-2">
      <p className="text-xl font-semibold">Samples</p>

      {samples.map((sample) => {
        return (
          <div
            onClick={(e) => onClick(sample.id)}
            key={sample.id}
            className="w-full cursor-pointer rounded-md px-4 py-2 transition hover:bg-slate-100"
          >
            <h2 className="text-lg font-semibold ">{sample.title}</h2>
            <p className="text-sm text-slate-600">
              {sample.text.slice(0, 40)}...
            </p>
          </div>
        )
      })}
      <Button variant={"secondary"} onClick={() => window.location.reload()}>
        Start over
      </Button>
    </div>
  )
}

export default SamplesSelection
