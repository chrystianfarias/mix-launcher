import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
//import icon from '../../assets/icon.svg';
import './Reset.css';
import styled from 'styled-components';
import MainView from './Pages/MainView';
import Sidebar from './Components/Sidebar';

const MainContainer = styled.div`
  background-color: #EBEBEB;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const CloseButton = styled.button`
  border: none;
  position: fixed;
  right: 0;
  top: 0;
  height: 60px;
  width: 60px;
  outline: none;
`;

const Main = () => {
  const AppQuit = () => {
    window.api.send("App.quit", {});
  };
  return (
    <MainContainer>
      <CloseButton onClick={AppQuit}>X</CloseButton>
      <Sidebar/>
      <MainView/>
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
