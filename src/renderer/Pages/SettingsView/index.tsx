import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { AiFillFolderOpen, AiOutlineCloudDownload } from 'react-icons/ai';

const StyledTextField = styled(TextField)`
  font-size: 8px;
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  ${StyledTextField} {
    width: 100%;
  }
`;

const Buttons = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  height: 40px;
  color: #3D327B;
`;

const SettingsView = () => {
  const [gameDir, setGameDir] = useState("/");
  const [mpmDir, setMPMDir] = useState("/");
  const [mpmInstall, setMPMInstall] = useState(false);

  useEffect(() => {
    window.api.send("ModController.getFolder", {});
    window.api.receive("ModController.receiveFolder", (folder:any) => {
      setGameDir(folder);
    });
    window.api.send("MPMController.getFolder", {});
    window.api.receive("MPMController.receiveFolder", (folder:any) => {
      setMPMDir(folder);
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

  return <Container>
    <Row>
      <Title>Settings</Title>
    </Row>
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
        ?<CircularProgress size={20}/>
        :<IconButton onClick={installMPM}>
          <AiOutlineCloudDownload/>
        </IconButton>}
      </Buttons>
    </Row>
    </Container>;
}
export default SettingsView;
