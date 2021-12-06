import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import headerImage from '../../../../assets/mixmods-header-1.jpg';
import Title from '../Title';
import Button from '@material-ui/core/Button';
import { BsFillPlayFill } from 'react-icons/bs';

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
  const AppQuit = () => {
    window.api.send("App.quit", {});
  };
  const openGame = () => {
    window.api.send("GameController.openGame", {});
  };
  return <StyledHeader>
      <StyledTitle>
        MixLauncher
      </StyledTitle>
      <StyledButtons>
        <Button onClick={openGame} color="success" variant="contained">
          Iniciar
          <BsFillPlayFill/>
        </Button>
      </StyledButtons>
      <CloseButton onClick={AppQuit}>
        <IoIosClose/>
      </CloseButton>
  </StyledHeader>
};

export default Header;
