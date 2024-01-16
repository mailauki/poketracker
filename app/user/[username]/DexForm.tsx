'use client'

import { useState } from "react"

export default function DexForm() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <button
        // className="w-2/4 py-2 px-3 flex items-center justify-center rounded-md text-white bg-blue-600 hover:bg-blue-700"
        className="w-2/4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        // data-modal-target="default-modal"
        // data-modal-toggle="default-modal"
        type="button"
        onClick={() => setOpen(true)}
      >
        Create New Dex
      </button>

      <div className={`${open ? "" : "hidden"} relative z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-background text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Dex
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setOpen(false)}>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                </p>
                <form className="space-y-4">
                  <div className="mb-6">
                    <label className="block font-medium text-gray-900 dark:text-gray-300 mb-2" htmlFor="password">
                      Title
                    </label>
                    <input className="appearance-none rounded w-full h-10 py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 mb-3 leading-tight" id="title" type="text" placeholder="Living Dex" />
                    <p className="text-gray-400 text-xs italic">/user/living-dex</p>
                  </div>
                  <div className="mb-6">
                    <label className="block font-medium text-gray-900 dark:text-gray-300 mb-2" htmlFor="game">
                      Game
                    </label>
                    <select className="appearance-none rounded w-full h-10 py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 mb-3 leading-tight" id="game">
                      <option selected>Select category</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                    </select>
                  </div>
                  <fieldset className="mb-6">
                    <legend className="block font-medium text-gray-900 dark:text-gray-300 mb-3">Type</legend>
                    <div className="flex">
                      <div className="flex items-center me-4">
                        <input id="national-radio" type="radio" value="National" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="national-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">National</label>
                      </div>
                      <div className="flex items-center me-4">
                        <input checked id="regional-radio" type="radio" value="Regional" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="regional-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Regional</label>
                      </div>
                      <div className="flex items-center me-4">
                        <input id="collective-radio" type="radio" value="Collective" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="collective-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Collective</label>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="mb-6">
                    <legend className="block font-medium text-gray-900 dark:text-gray-300 mb-3">Customizations</legend>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                      </div>
                      <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Shiny</label>
                    </div>
                  </fieldset>
                </form>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                </p>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                className="w-full block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                // type="submit" 
                onClick={() => setOpen(false)}
              >
                Create
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}