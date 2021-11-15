import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import headerImage from '../../../../assets/mixmods-header-1.jpg';

const StyledHeader = styled.div`
  height: 200px;
  min-height: 200px;
  background: url(${headerImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
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
  return <StyledHeader>

      <CloseButton onClick={AppQuit}>
        <IoIosClose/>
      </CloseButton>
  </StyledHeader>
};

export default Header;
