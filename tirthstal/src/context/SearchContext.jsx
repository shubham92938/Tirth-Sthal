import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [selectedState,  setSelectedState]  = useState("Maharashtra");
  const [searchResults,  setSearchResults]  = useState([]);
  const [hasSearched,    setHasSearched]    = useState(false);

  return (
    <SearchContext.Provider value={{
      searchQuery,    setSearchQuery,
      selectedState,  setSelectedState,
      searchResults,  setSearchResults,
      hasSearched,    setHasSearched,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);