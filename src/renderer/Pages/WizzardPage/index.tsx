import { useEffect, useState } from 'react';
import Title from 'renderer/Components/Title';
import styled from 'styled-components';
import backgroundImage from '../../../../assets/mixmods-main.jpg';
import PulseLoader from "react-spinners/PulseLoader";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { AiFillFolderOpen, AiOutlineCloudDownload } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#ffffff',
    },
    divider: '#ffffff',
    text: {
      primary: '#ffffff'
    }
  },
});
const StyledTextField = styled(TextField)`
  && {
    color: "#fff";
  }
`;
interface WizzardProps {
  onSelect:any;
}

const MainContainer = styled.div`
  background: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right 0px top 0px;
  box-sizing: border-box;
  display: flex;

  width: 100vw;
  height: 100vh;
  padding: 100px;
  display: flex;
`;
const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
`;
const MessageContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff !important;
  opacity: .4;

  p {
    margin-top: 10px;
    font-weight: 200;
    text-align: justify;
    line-height: 20px;
  }
`;
const Row = styled.div`
  width: 100%;
  margin-bottom: 25px;
  display: flex;
  align-items: center;

  ${StyledTextField} {
    width: 100%;
  }
`;
const RowVertical = styled(Row)`
  flex-direction: column;
`;

const Buttons = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;

  svg {
    color: #ffffff;
  }
`;
const CloseButton = styled.button`
  border: none;
  position: fixed;
  right: 0;
  top: 0;
  background: none;
  height: 40px;
  width: 40px;
  outline: none;
  -webkit-app-region: no-drag;
  transition: ease .3s background;
  border-radius: 5px;

  svg {
    width: 30px;
    height: 30px;
    color: #ffffff;
  }

  &:hover {
    background: #e74c3c;
    transition: ease .5s background;
  }
`;

const messages = [
  "Ah shit here we go again",
  "Follow the train CJ!"
];

const LoadingBox = () => {
  const [ phrase, setPhrase ] = useState("Aguarde, estamos preparando tudo para você");
  let currentPhrase = 0;

  useEffect(() => {
    setPhrase(messages[currentPhrase]);
    window.setInterval(() => {
      currentPhrase += 1;
      if (currentPhrase == messages.length)
        currentPhrase = 0;
      setPhrase(messages[currentPhrase]);
    }, 3000);
  }, []);
  return <MessageContainer>
          <PulseLoader loading={true} color="#ffffff"/>
          <p>{phrase}</p>
        </MessageContainer>;
}

const SettingsBox: React.FC<WizzardProps> = ({
  onSelect
}) => {
  const [gameDir, setGameDir] = useState("/");
  const [mpmDir, setMPMDir] = useState("/");
  const [mpmInstall, setMPMInstall] = useState(false);
  const [folderChecked, setFolderChecked] = useState(false);

  const check = () => {
    window.api.send("ModController.checkFolder", {});
  }
  useEffect(() => {
    check();
    window.api.receive("ModController.receiveCheckFolder", (check:boolean) => {
      setFolderChecked(check);
    });
    window.api.send("ModController.getFolder", {});
    window.api.receive("ModController.receiveFolder", (folder:any) => {
      setGameDir(folder);
      check();
    });
    window.api.send("MPMController.getFolder", {});
    window.api.receive("MPMController.receiveFolder", (folder:any) => {
      setMPMDir(folder);
      check();
    });
    window.api.receive("MPMController.receiveInstall", () => {
      setMPMInstall(false);
    });
  }, []);

  const setGameFolder = () => {
    window.api.send("ModController.setFolder", {});
  };

  const setMPMFolder = () => {
    window.api.send("MPMController.setFolder", {});
  };

  const installMPM = () => {
    setMPMInstall(true);
    window.api.send("MPMController.install", {});
  };
  const AppQuit = () => {
    window.api.send("App.quit", {});
  };

  return <MessageContainer>
    
      <CloseButton onClick={AppQuit}>
        <IoIosClose/>
      </CloseButton>
      <RowVertical>
        <p>Para que tudo funciona corretamente, precisamos de algumas informações importantes.</p>
        <p>Você possui o MPM (MixPackageManager) instalado? Caso sim, localize o diretório no campo abaixo. Se não tiver não se preocupe, nós resolvemos isso para você.</p>
        <p>Ah, e por último no outro campo localize o executável de seu Game. Vamos lá?</p>
      </RowVertical>
      <Row>
      <StyledTextField
        label="Game Directory"
        value={gameDir}
        InputProps={{
          readOnly: true,
        }}
      />
      <Buttons>
        <IconButton onClick={setGameFolder}>
            <AiFillFolderOpen/>
        </IconButton>
      </Buttons>
    </Row>
    <Row>
      <StyledTextField
        label="MPM Directory"
        value={mpmDir}
        InputProps={{
          readOnly: true,
        }}
      />
      <Buttons>
        <IconButton onClick={setMPMFolder}>
            <AiFillFolderOpen/>
        </IconButton>
        {mpmInstall
        ?<p>...</p>
        :<IconButton onClick={installMPM}>
          <AiOutlineCloudDownload/>
        </IconButton>}
      </Buttons>
    </Row>
    <Row>
      <Button disabled={!folderChecked} variant="contained" onClick={onSelect}>Iniciar</Button>
    </Row>
    </MessageContainer>
}

const WizzardPage: React.FC<WizzardProps> = ({
  onSelect
}) => {
  const [ isLoading, setLoading ] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  },[]);

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <SideContainer>
          <Title>MixLauncher<span>v1.0.2a</span></Title>
          {isLoading ? <LoadingBox/> : <SettingsBox onSelect={onSelect}/>}
        </SideContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default WizzardPage;
