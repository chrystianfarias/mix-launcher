import React, { createContext, useState } from "react";
import Category from "renderer/Models/Category";

type PageType = {
  page: string;
  category?: Category;
}

type PropsPageContext = {
  state: PageType;
  setState: React.Dispatch<React.SetStateAction<PageType>>;
}

const DEFAULT_VALUE = {
  state: {
    page: ""
  },
  setState: () => {}
}

const PageContext = createContext<PropsPageContext>(DEFAULT_VALUE);

const PageContextProvider: React.FC = ({children}) => {
  const [state, setState] = useState(DEFAULT_VALUE.state);
  return (
    <PageContext.Provider
      value={{
        state,
        setState
      }}
    >
      {children}
    </PageContext.Provider>
  )
}
export { PageContextProvider };
export default PageContext;
