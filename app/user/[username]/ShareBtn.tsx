import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"

export default function ShareBtn({ url }: { url: string }) {
  return (
    <button className="text-gray-500 dark:text-gray-400 bg-transparent hover:text-gray-900 rounded-full text-sm w-10 h-10 inline-flex justify-center items-center dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900" onClick={() => console.log(url)}>
      <ArrowUpOnSquareIcon className="h-6 w-6" />
      <span className="sr-only">Share this dex</span>
    </button>
  )
}