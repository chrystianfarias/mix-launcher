import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import headerImage from '../../../../assets/mixmods-header-1.jpg';
import Title from '../Title';
import Button from '@material-ui/core/Button';
import { BsFillPlayFill } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';

const StyledTitle = styled(Title)`
  font-size: 60px;
  -webkit-user-select: none;
  user-select: none;
`;

const StyledButtons = styled.div`
  height: 100%;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledHeader = styled.div`
  padding: 30px;
  display:flex;
  box-sizing: border-box;
  height: 200px;
  min-height: 200px;
  background: url(${headerImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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

const Header = () => {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    window.api.receive("GameController.onCloseGame", (code:any) => {
      console.log(code);
      setRunning(false);
    });
  }, []);
  const AppQuit = () => {
    window.api.send("App.quit", {});
  };
  const openGame = () => {
    if (running)
    {
      window.api.send("GameController.closeGame", {});
    }
    else
    {
      window.api.send("GameController.openGame", {});
    }
    setRunning(!running);
  };
  return <StyledHeader>
      <StyledTitle>
        MixLauncher
      </StyledTitle>
      <StyledButtons>
        <Button onClick={openGame} color={running?"error":"success"} variant="contained">
          {running?
          <>Fechar
          <IoMdClose/></>
          :<>Iniciar
          <BsFillPlayFill/></>}
        </Button>
      </StyledButtons>
      <CloseButton onClick={AppQuit}>
        <IoIosClose/>
      </CloseButton>
  </StyledHeader>
};

export default Header;
