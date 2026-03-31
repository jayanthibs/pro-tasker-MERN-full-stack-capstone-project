import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext(null);

 function GlobalStateProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// Custom hook for easier access
export function useGlobalState() {
  return useContext(GlobalStateContext);
}

export default GlobalStateProvider;