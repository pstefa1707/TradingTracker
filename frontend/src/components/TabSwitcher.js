const TabSwitcher = ({ tabHeaders, activeTab, setActiveTab }) => {
  const selectedCss =
    "inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white";
  const unselectedCss =
    "inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer";

  return (
    <ul className="text-sm font-medium text-center text-gray-500 shadow flex dark:divide-gray-700 dark:text-gray-400">
      {tabHeaders.map((tabName) => (
        <li key={tabName} className="w-full">
          <div
            className={activeTab === tabName ? selectedCss : unselectedCss}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TabSwitcher;
