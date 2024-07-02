import React, { createContext, useContext, useState } from "react";

const FilterButtonContext = createContext();

export const useFilterButton = () => useContext(FilterButtonContext);

export const FilterButtonProvider = ({ children }) => {
  const [openButton, setOpenButton] = useState(null);

  return (
    <FilterButtonContext.Provider value={{ openButton, setOpenButton }}>
      {children}
    </FilterButtonContext.Provider>
  );
};