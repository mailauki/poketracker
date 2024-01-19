import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <form className="grow">   
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <div
          className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full ps-10 rounded-md px-4 py-2 bg-inherit border"
          placeholder="Search name, number..."
        />
        <button type="button" className="absolute end-2 top-1 text-gray-400 bg-transparent hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900" data-modal-hide="default-modal">
          <XMarkIcon className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Clear</span>
        </button>
        {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
      </div>
  </form>
  )
}