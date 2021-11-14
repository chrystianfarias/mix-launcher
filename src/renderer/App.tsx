import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './Reset.css';
import styled from 'styled-components';
import MainView from './Pages/MainView';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';

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
  return (
    <MainContainer>
      <Sidebar/>
      <ContentContainer>
        <Header/>
        <MainView/>
      </ContentContainer>
    </MainContainer>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
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
