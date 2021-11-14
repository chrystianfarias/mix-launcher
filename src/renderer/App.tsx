import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
//import icon from '../../assets/icon.svg';
import './App.css';
import MainView from './Pages/MainView';

const Hello = () => {
  return (
    <div>
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
