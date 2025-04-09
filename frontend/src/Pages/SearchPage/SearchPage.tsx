import { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";
import Search from "../../Components/Search/Search";

interface Props { }

interface SearchTile {
  id: number;
  question: string;
  content: string;
}

const MAX_TILES = 20;

const SearchPage = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  const [tiles, setTiles] = useState<SearchTile[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState<string>("http://localhost:5000/query");

  useEffect(() => {
    // Prevent full-page scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "document") {
      setSelectedApi("http://localhost:5000/query");
    } else if (value === "datasource") {
      setSelectedApi("http://localhost:8000/query");
    }
  };

  const queryDynamicAPI = async (query: string) => {
    try {
      const response = await fetch(selectedApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });
      return await response.json();
    } catch (err) {
      return "Server error. Please try again.";
    }
  };

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await queryDynamicAPI(search);
    console.log("API Response:", result);

    if (typeof result === "string" || (!result.answer && !result.top_matches)) {
      setServerError("Error fetching data");
    } else {
      const isDatasource = selectedApi.includes("8000");

      const newTile: SearchTile = {
        id: Date.now(),
        question: search,
        content: isDatasource
          ? result.answer || "No content found"
          : result.top_matches?.[0]?.content || result.answer || "No content found",
      };


      setTiles((prev) => {
        const updated = [newTile, ...prev];
        return updated.length > MAX_TILES ? updated.slice(0, MAX_TILES) : updated;
      });

      setServerError(null);
    }

    setSearch("");
  };

  const removeTile = (id: number) => {
    setTiles((prev) => prev.filter((tile) => tile.id !== id));
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Dropdown */}
      <div className="mb-4">
        <select onChange={handleDropdownChange} className="p-2 border rounded">
          <option value="document">Document Upload</option>
          <option value="datasource">Datasource</option>
        </select>
      </div>

      {/* Search */}
      <Search
        onSearchSubmit={onSearchSubmit}
        search={search}
        handleSearchChange={handleSearchChange}
      />

      {serverError && <div className="text-red-500 p-4">{serverError}</div>}

      {/* Scrollable & Resizable Tiles */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="bg-white shadow-md rounded-xl p-4 relative border resize overflow-auto min-h-[150px] min-w-[200px] max-h-[500px]"
            >
              <button
                onClick={() => removeTile(tile.id)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                ×
              </button>
              <div className="font-semibold text-gray-700 mb-2">Question Asked:</div>
              <div className="text-gray-900 mb-3">{tile.question}</div>
              <div className="font-semibold text-gray-700">Result:</div>
              <div className="text-gray-800 whitespace-pre-line">{tile.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
