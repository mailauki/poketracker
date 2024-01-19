import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"

export default function ShareBtn({ url }: { url: string }) {
  return (
    <button onClick={() => console.log(url)}>
      <ArrowUpOnSquareIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      <span className="sr-only">Share this dex</span>
    </button>
  )
}