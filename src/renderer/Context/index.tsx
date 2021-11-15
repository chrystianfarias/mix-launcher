import React from "react";

import { PageContextProvider } from "./PageContextProvider";

const GlobalContext: React.FC = ({children}) => {
  return <PageContextProvider>{children}</PageContextProvider>
}

export default GlobalContext;
