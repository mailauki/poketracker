import { ChangeEventHandler } from "react";

export default function Search({
  keyword, handleSearchChange,
}: {
  keyword: string,
  // eslint-disable-next-line no-unused-vars
  handleSearchChange: ChangeEventHandler<HTMLInputElement>
}) {
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
					value={keyword}
					onChange={handleSearchChange}
        />
      </div>
  </form>
  )
}