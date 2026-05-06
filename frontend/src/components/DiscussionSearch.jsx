import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function DiscussionSearch({ 
  onSearch, 
  onNewDiscussionClick, 
  searchQuery,
  onFilterChange,
  currentFilter 
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || "");

  // wait 5s after user stop typing then cancel previous timer if input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localQuery); 
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery]);

  // if searchQuery changes update local query
  useEffect(() => {
    setLocalQuery(searchQuery || "");
  }, [searchQuery]);
  
  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery("");
    onSearch("");
  };

  const filters = [
    { label: "Latest", value: "latest" },
    { label: "Popular", value: "popular" },
    { label: "Unanswered", value: "unanswered" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
        {/* Search Bar */}
        <div className="flex flex-1 items-center bg-white border border-gray-300 rounded px-2">
          <FaSearch className="text-gray-400 mr-2" size={14} />
          <input
            type="text"
            value={localQuery}
            onChange={handleChange}
            placeholder="Search discussions by title or content..."
            className="flex-1 p-2 text-sm placeholder-gray-500 focus:outline-none"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-1 rounded text-sm transition w-auto ${
                currentFilter === filter.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black hover:bg-blue-500 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags + New Discussion */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {["#web development", "#UI design", "#React"].map((tag) => (
            <div
              key={tag}
              className="px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-sm"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* New Discussion Button */}
        <div className="mt-2 md:mt-0">
          <button 
            onClick={onNewDiscussionClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-auto"
          >
            <FaPlus size={12} /> New Discussion
          </button>
        </div>
      </div>
    </div>
  );
}