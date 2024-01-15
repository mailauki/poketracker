import { useEffect, useState } from "react"

export default function Progress({ captured, entries } : { captured: number, entries: number }) {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const percent = ((captured/entries) * 100)
    if(String(percent).includes('.')) {
      setProgress(Number(percent.toFixed(2)))
    } else {
      setProgress(percent)
    }
  }, [captured, entries])

  return (
    <div className="py-2 px-3 flex flex-col items-center rounded-full bg-btn-background border text-sm gap-4 w-full">
      <p><b>{progress}%</b> DONE! (<b>{captured}</b> CAUGHT, <b>{entries-captured}</b> TO GO)</p>
    </div>
  )
}