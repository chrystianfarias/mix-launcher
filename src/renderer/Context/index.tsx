import React from "react";

import { PageContextProvider } from "./PageContextProvider";
import { LanguageContextProvider } from "./LanguageContextProvider";

const GlobalContext: React.FC = ({children}) => {
  return <PageContextProvider>
      <LanguageContextProvider>
      {children}
      </LanguageContextProvider>
    </PageContextProvider>
}

export default GlobalContext;
