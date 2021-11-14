import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
//import icon from '../../assets/icon.svg';
//import './App.css';
import styled from 'styled-components';
import MainView from './Pages/MainView';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Hello = () => {
  return (
    <div>
      <Title>OIIIIIIIII</Title>
      <MainView/>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
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
