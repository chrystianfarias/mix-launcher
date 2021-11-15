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
import SettingsView from './Pages/SettingsView';

const MainContainer = styled.div`
  background-color: #EBEBEB;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const PageContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: auto;
  scrollbar-color: #3D327B #EBEBEB;

  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3D327B;
    border-radius: 10px;
    border: 6px solid #EBEBEB;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-shrink: 1;
`;

const Main = () => {

  const GetPage = () => {
    const {state} = useContext(PageContext)
    console.log(state.category);
    switch(state.page){
      case "main":
        return <MainView/>;
      case "settings":
        return <SettingsView/>
      default:
        return <CategoryView category={state.category}/>
    }
  };

  return (
    <MainContainer>
      <Sidebar/>
      <ContentContainer>
        <Header/>
        <PageContainer>
          {GetPage()}
        </PageContainer>
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
