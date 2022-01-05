import { useContext, useEffect, useState } from 'react';
import LanguageContext from 'renderer/Context/LanguageContextProvider';
import Category from 'Models/Category';
import styled from 'styled-components';
import icon from '../../../../assets/mixmods-logo-min.png';
import PageContext from '../../Context/PageContextProvider';
import api from "../../Services/api";
import { IoSettingsSharp } from "react-icons/io5";
import IconButton from '@material-ui/core/IconButton';
import { LoadingCategoryItem, CategoryItem, BasicItem } from './CategoryItem';
import modIcon from '../../../../assets/icons/pencil.png';
import newsIcon from '../../../../assets/icons/news.png';
import inspectIcon from '../../../../assets/icons/loupe.png';


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
    padding: 35px;
    font-weight: 600;
    color: #fff;
    font-size: 18px;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;

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
    return [...Array(4)].map(()=><LoadingCategoryItem/>);
  }

  return <StyledSidebar>
    <StyledIcon onClick={() => setState({page: "main", arg:"main"})} src={icon}/>
    <Categories>
      <BasicItem image={newsIcon} page="main">
        Notícias
      </BasicItem>
      <BasicItem image={modIcon} page="mods">
        Mods instalados
      </BasicItem>
      <BasicItem image={inspectIcon} page="check">
        Verificar Jogo
      </BasicItem>
      <h1>Mods</h1>
      {categories.length == 0?renderLoadingCategories():renderCategories()}
    </Categories>
    <StyledFooter>
        <StyledButton onClick={() => setState({page: "settings", arg:"settings"})}>
          <IoSettingsSharp/>
        </StyledButton>
        <span>
          v1.0.2a
        </span>
    </StyledFooter>
  </StyledSidebar>
};

export default Sidebar;
