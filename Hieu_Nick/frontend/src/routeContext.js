import React from "react";

const RouteContext = React.createContext();

export function RouteProvider({ children }) {
  const [route, setRoute] = React.useState('');

  const contextValue = {
    route,
    setRoute
  };

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
    return React.useContext(RouteContext);
}