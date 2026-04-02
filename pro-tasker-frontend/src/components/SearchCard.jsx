import { useState, useMemo, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
function SearchCard({ data, onFilter, setSearchQuery }) { 
  const [searchData, setSearchData] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const isTyping = useMemo(
    () => searchData !== debouncedQuery,
    [debouncedQuery, searchData]
  );
 useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchData);
    const results = searchData
      ? data.filter((item) =>
          (item.name || item.title)
            ?.toLowerCase()
            .includes(searchData.toLowerCase())
        )
      : data;
    onFilter(results);
    setSearchQuery(searchData); 
  }, 500);
  return () => clearTimeout(timer);
}, [searchData, data, onFilter, setSearchQuery]);
  return (
    <div className="w-full flex justify-center mb-4">
      <div className="relative w-full max-w-xl">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
          className="w-full border rounded-lg h-10 bg-white pl-10 pr-3"
        />
      </div>
      {isTyping && (
        <p className="text-sm text-gray-500 ml-3">Searching...</p>
      )}
    </div>
  );
}
export default SearchCard;