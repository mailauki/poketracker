export default function CaughtToggle({
  caughtToggle, handleToggleChange
}: {
  caughtToggle: string,
  handleToggleChange: (value: string) => void
}) {
  return (
    <ul className="flex justify-start text-sm font-medium text-center text-gray-500 dark:text-gray-400" role="tablist">
      <li className="me-2">
        <button
          className={`inline-block px-4 py-3 rounded-md ${caughtToggle === "all" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
          value="all"
          type="button"
          role="tab"
          aria-selected={"all" == caughtToggle}
          onClick={() => handleToggleChange("all")}
        >
          All
        </button>
      </li>
      <li className="me-2">
        <button
          className={`inline-block px-4 py-3 rounded-md ${caughtToggle === "caught" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
          value="caught"
          type="button"
          role="tab"
          aria-selected={"caught" == caughtToggle}
          onClick={() => handleToggleChange("caught")}
        >
          Caught
        </button>
      </li>
      <li className="me-2">
        <button
          className={`inline-block px-4 py-3 rounded-md ${caughtToggle === "missing" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
          value="missing"
          type="button"
          role="tab"
          aria-selected={"missing" == caughtToggle}
          onClick={() => handleToggleChange("missing")}
        >
          Missing
        </button>
      </li>
    </ul>
  )
}