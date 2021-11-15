import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { useContext } from 'react';
import GlobalContext from './Context';
import './Reset.css';
import './Roboto.css';
import styled from 'styled-components';
import MainView from './Pages/MainView';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import PageContext from './Context/PageContextProvider';
import CategoryView from './Pages/CategoryView';

const MainContainer = styled.div`
  background-color: #EBEBEB;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-shrink: 1;
`;

const Main = () => {
  const {state} = useContext(PageContext)

  const GetPage = () => {
    switch(state.page){
      default: case "main":
        return <MainView/>
      case "essentials":
        return <CategoryView fullInstall={true}/>
      case "graphics":
        return <CategoryView fullInstall={false}/>
      case "tcs":
        return <CategoryView fullInstall={false}/>
    }
  };

  return (
    <MainContainer>
      <Sidebar/>
      <ContentContainer>
        <Header/>
        {GetPage()}
      </ContentContainer>
    </MainContainer>
  );
};

export default function App() {
  return (
    <GlobalContext>
      <Router>
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
      </Router>
    </GlobalContext>
  );
}

declare global {
  interface Window {
    api: {
      send: (key: string, val: any) => any;
      receive: (key: string, val: any) => void;
    };
  }
}
