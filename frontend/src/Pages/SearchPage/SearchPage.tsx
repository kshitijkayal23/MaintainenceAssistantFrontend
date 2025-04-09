import { useState, ChangeEvent, SyntheticEvent } from "react";
import { queryFlaskAPI } from "../../api";
import Search from "../../Components/Search/Search";
import SearchResult from "../../Components/SearchResult/SearchResul";

interface Props {}

const SearchPage = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any>();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await queryFlaskAPI(search);
    setServerError(result ?? null);
    // if (typeof result === "string") {
    //   setServerError(result);
    // } else if (Array.isArray(result)) {
      setSearchResult(result);
      console.log(result);
    // }
  };
  return (
    <>
      <Search
        onSearchSubmit={onSearchSubmit}
        search={search}
        handleSearchChange={handleSearchChange}
      />

      {serverError && <div>Unable to connect to API</div>}

      {searchResult && <SearchResult result={searchResult} />}
    </>
  );
};

export default SearchPage;