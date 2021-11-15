import React, { createContext, useState } from "react";


type PropsLanguageContext = {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const DEFAULT_VALUE = {
  state: "pt_br",
  setState: () => {}
}

const LanguageContext = createContext<PropsLanguageContext>(DEFAULT_VALUE);

const LanguageContextProvider: React.FC = ({children}) => {
  const [state, setState] = useState(DEFAULT_VALUE.state);
  return (
    <LanguageContext.Provider
      value={{
        state,
        setState
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
export { LanguageContextProvider };
export default LanguageContext;
