
import ButtonBase from '@material-ui/core/ButtonBase';
import { useContext, useState } from 'react';
import Category from 'Models/Category';
import PageContext from '../../Context/PageContextProvider';
import styled from 'styled-components';
import Skeleton from '@material-ui/core/Skeleton';

interface StyledCategoryImageProps {
  isLoading: boolean;
}
interface CategoryProps {
  image: string;
  category: Category;
}
interface BasicProps {
  onClick?: any;
  page: string;
  image: string;
}
interface StyledCategoryProps {
  isSelected: boolean;
}
const CategoryItemImage = styled.div<StyledCategoryImageProps>`
  width: 28px;
  height: 28px;
  margin-left: 30px;
  margin-right: 20px;
  display: ${props => props.isLoading?"none":"block"};

  img {
    width: 100%;
    height: 100%;
  }
`;
const StyledLoadingCategoryItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 60px;
  width: 100%;
`;
const StyledButtonBase = styled(ButtonBase)`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  color: #fff !important;
`;

const StyledCategoryItem = styled.div<StyledCategoryProps>`
display: flex;
align-items: center;
cursor: pointer;
height: 60px;
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
}
`;
const LoadingCategoryItem = () => {
  return <StyledLoadingCategoryItem>
    <CategoryItemImage isLoading={true}>
      <Skeleton variant="circular" width={28} height={28} />
    </CategoryItemImage>
    <Skeleton variant="text" />
  </StyledLoadingCategoryItem>;
};
const BasicItem: React.FC<BasicProps> = ({
  children,
  onClick,
  image,
  page
}) => {
  const {state, setState} = useContext(PageContext)

  const OnClick = () => {
    setState({page: page, arg:page});
    if (onClick)
      onClick();
  };

  return <StyledButtonBase onClick={OnClick}>
    <StyledCategoryItem isSelected={state.arg==page}>
      <CategoryItemImage isLoading={false}>
        <img src={image} key={image}/>
      </CategoryItemImage>
      {children}
    </StyledCategoryItem>
  </StyledButtonBase>
}
const CategoryItem: React.FC<CategoryProps> = ({
  children,
  image,
  category
}) => {
  const {state, setState} = useContext(PageContext)
  const [loading, setLoading] = useState(true);

  const OnCategoryClick = () => {
    setState({page: category.languages["en_us"].name, arg:category});
  };

  return <StyledButtonBase onClick={OnCategoryClick}>
    <StyledCategoryItem isSelected={state.arg==category}>
      <CategoryItemImage isLoading={loading}>
        {loading?<Skeleton variant="circular" width={28} height={28} />:<></>}
        <img src={image} key={image} onLoad={()=>setLoading(false)}/>
      </CategoryItemImage>
      {children}
    </StyledCategoryItem>
  </StyledButtonBase>
};

export {CategoryItem, LoadingCategoryItem, BasicItem, CategoryItemImage}
