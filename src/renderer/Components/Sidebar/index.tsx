import { useContext } from 'react';
import styled from 'styled-components';
import icon from '../../../../assets/mixmods-logo-min.png';
import exclamationIcon from '../../../../assets/icons/exclamation.png';
import materialIcon from '../../../../assets/icons/material.png';
import refreshIcon from '../../../../assets/icons/refresh.png';
import PageContext from '../../Context/PageContextProvider';

const StyledSidebar = styled.div`
  background: #272B35;
  min-width: 300px;
  max-width: 300px;
  user-select: none;
`;

const StyledIcon = styled.img`
  width: 37px;
  height: 37px;
  margin: 40px;
  cursor: pointer;
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h1 {
    padding: 40px;
    font-weight: 500;
    color: #fff;
    font-size: 18px;
  }
`;


interface CategoryProps {
  image: string;
  page: string;
}
interface StyledCategoryProps {
  isSelected: boolean;
}

const StyledCategoryItem = styled.div<StyledCategoryProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 31px;
  margin-bottom: 30px;
  width: 100%;
  color: #fff;
  transition: opacity ease .5s;
  opacity: ${props => props.isSelected?1:0.4};
  &::before {
    content: "";
    width: 5px;
    height: 100%;
    background-color: ${props => props.isSelected?"#6A6DEA":"transparent"};
  }
  &:hover {
    opacity: 0.8;
    transition: opacity ease .1s;
  }
  img {
    width: 28px;
    height: 28px;
    margin-left: 30px;
    margin-right: 20px;
  }
`;

const CategoryItem: React.FC<CategoryProps> = ({
  children,
  image,
  page
}) => {
  const {state, setState} = useContext(PageContext)

  const OnCategoryClick = () => {
    setState({page: page});
  };

  return <StyledCategoryItem onClick={OnCategoryClick} isSelected={state.page==page}>
    <img src={image}/>
    {children}
  </StyledCategoryItem>
};

const Sidebar = () => {
  const {setState} = useContext(PageContext)
  return <StyledSidebar>
    <StyledIcon onClick={() => setState({page: "main"})} src={icon}/>
    <Categories>
      <h1>Categories</h1>
      <CategoryItem page={"essentials"} image={exclamationIcon}>
        Essentials Pack
      </CategoryItem>
      <CategoryItem page={"graphics"} image={materialIcon}>
        Graphics
      </CategoryItem>
      <CategoryItem page={"tcs"} image={refreshIcon}>
        TCs
      </CategoryItem>
    </Categories>
  </StyledSidebar>
};

export default Sidebar;
