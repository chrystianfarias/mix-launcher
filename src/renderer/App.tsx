import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './Reset.css';
import './Roboto.css';
import GlobalContext from './Context';
import MainPage from './Pages/MainPage';
import WizzardPage from './Pages/WizzardPage';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#3D327B',
      main: '#3D327B',
      dark: '#ffffff'
    }
  },
});

const Main = () => {
  const [mpmDir, setMPMDir] = useState(undefined);
  useEffect(() => {
    window.api.send("MPMController.getFolder", {});
    window.api.receive("MPMController.receiveFolder", (folder:any) => {
      setTimeout(() => {
        setMPMDir(folder);
      }, 2000);
    });
  }, []);
  let first = mpmDir == undefined;
  return first ? <WizzardPage/> : <MainPage/>;
};

export default function App() {
  return (
    <GlobalContext>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/" component={Main} />
          </Switch>
        </Router>
      </ThemeProvider>
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
