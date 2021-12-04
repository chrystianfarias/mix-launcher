import { useContext, useEffect, useState } from 'react';
import LanguageContext from 'renderer/Context/LanguageContextProvider';
import Category from 'Models/Category';
import styled from 'styled-components';
import icon from '../../../../assets/mixmods-logo-min.png';
import PageContext from '../../Context/PageContextProvider';
import api from "../../Services/api";
import { IoSettingsSharp } from "react-icons/io5";
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Skeleton from '@material-ui/core/Skeleton';


interface CategoryProps {
  image: string;
  category: Category;
}
interface StyledCategoryProps {
  isSelected: boolean;
}
interface StyledCategoryImageProps {
  isLoading: boolean;
}

const StyledSidebar = styled.div`
  background: #272B35;
  min-width: 300px;
  max-width: 300px;
  user-select: none;
  display: flex;
  flex-direction: column;
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
  height: 100%;

  h1 {
    padding: 40px;
    font-weight: 500;
    color: #fff;
    font-size: 18px;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;

  span {
    color: #fff;
    font-size: 10px;
    opacity: .4;
  }
`;

const StyledButton = styled(IconButton)`

  svg {
    color: #fff;
    width: 20px;
    height: 20px;

    opacity: .4;
    transition: opacity ease .6s;
  }

  &:hover {
    svg {
      opacity: 1;
      transition: opacity ease .2s;
    }
  }
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
const LoadingCategoryItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 60px;
  width: 100%;
`;

const CategoryItem: React.FC<CategoryProps> = ({
  children,
  image,
  category
}) => {
  const {state, setState} = useContext(PageContext)
  const [loading, setLoading] = useState(true);

  const OnCategoryClick = () => {
    console.log(category);
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

const Sidebar = () => {
  const {setState} = useContext(PageContext)
  const language = useContext(LanguageContext)

  let [ categories, setCategories ] = useState([] as Category[]);

  const getCategory = async (url:string) => {
    let response = await api.get(url);
    categories = [...categories,response.data]
    setCategories(categories);
  }
  useEffect(() => {
    categories = [];
    api
      .get("/categories.json")
      .then((response) => {
        response.data.map(async (categoryUrl:string) => await getCategory(categoryUrl));
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, []);

  const renderCategories = () => {
    return categories.map((category:any, index:number)=>
      <CategoryItem key={index} category={category} image={api.defaults.baseURL + "/" + category.icon}>
        {category.languages[language.state].name}
      </CategoryItem>);
  }
  const renderLoadingCategories = () => {
    return [...Array(4)].map(()=>
    <LoadingCategoryItem>
      <CategoryItemImage isLoading={true}>
        <Skeleton variant="circular" width={28} height={28} />
      </CategoryItemImage>
      <Skeleton variant="text" />
    </LoadingCategoryItem>);
  }

  return <StyledSidebar>
    <StyledIcon onClick={() => setState({page: "main"})} src={icon}/>
    <Categories>
      <h1>Categories</h1>
      {categories.length == 0?renderLoadingCategories():renderCategories()}
    </Categories>
    <StyledFooter>
        <StyledButton onClick={() => setState({page: "settings"})}>
          <IoSettingsSharp/>
        </StyledButton>
        <span>
          v1.0.0
        </span>
    </StyledFooter>
  </StyledSidebar>
};

export default Sidebar;
