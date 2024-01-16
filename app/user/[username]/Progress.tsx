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
    <div className="w-full h-8 bg-blue-100 rounded-full dark:bg-blue-950 overflow-auto relative">
      <div className="w-full h-8 flex items-center justify-center text-sm text-center absolute">
        <p><b>{progress}%</b> DONE! (<b>{captured}</b> CAUGHT, <b>{entries-captured}</b> TO GO)</p>
      </div>
      <div className="h-8 bg-blue-600 dark:bg-blue-500" style={{ width: `${progress}%`}}></div>
    </div>
  )
}