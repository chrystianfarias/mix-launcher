
import { useEffect, useState } from 'react';
import CategoryItem from "./Components/CategoryItem";
import styled from 'styled-components';
import Category from "renderer/Models/Category";
import Mod from 'renderer/Models/Mod';
import api from "../../Services/api";

interface CategoryViewProps {
  category?: Category
}

const StyledCategoryView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  user-select: none;
`;


const CategoryView: React.FC<CategoryViewProps> = ({
  category
}) => {
    let [ mods, setMods ] = useState([] as Mod[]);

    const getMod = async (url:string) => {
      let response = await api.get(url);
      mods = [...mods,response.data]
      setMods(mods);
    }
    useEffect(() => {
      setMods([]);
      mods = [];
      category?.mods.map(async (mod) => await getMod(mod));
    }, [category]);

    return <StyledCategoryView>
      {mods.map((mod:Mod, index:number) => <CategoryItem key={index} mod={mod}/>)}
    </StyledCategoryView>
};

export default CategoryView;
