import ProjectCard from "./ProjectCard";
import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TaskCard from "./TaskCard";

function SearchCard({ data }) {
  const [searchData, setSearchData] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const isTyping = useMemo(
    () => searchData !== debouncedQuery,
    [debouncedQuery, searchData],
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchData);
      setFilteredData(
        searchData
          ? data.filter((item) =>
              (item.name || item.title)
  ?.toLowerCase()
  .includes(searchData.toLowerCase())
            )
          : [],
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [searchData, data]);

  return (
    <>
    <div className="w-full flex justify-center">
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
</div>
      {isTyping && <p className="text-sm text-gray-500">Searching...</p>}
      {/* Search Results */}
      {filteredData.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Search Results:</h2>
          <div className="flex flex-col gap-3">
            {filteredData.map((item) =>
  item.title ? (
    <TaskCard key={item._id} task={item} setTasks={() => {}} />
  ) : (
    <ProjectCard key={item._id} project={item} variant="dashboard" />
  )
)}
          </div>
        </div>
      )}
    </>
  );
}


export default SearchCard;