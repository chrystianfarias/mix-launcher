import styled from 'styled-components';
import icon from '../../../../assets/mixmods-logo-min.png';

const StyledSidebar = styled.div`
  background: #272B35;
  min-width: 300px;
  max-width: 300px;
`;

const StyledIcon = styled.img`
  width: 37px;
  height: 37px;
  margin: 40px;
`;

const Sidebar = () => {
  return <StyledSidebar>
    <StyledIcon src={icon}/>
  </StyledSidebar>
};

export default Sidebar;
