
import CategoryItem from "./CategoryItem";
import styled from 'styled-components';
import Category from "Models/Category";

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
    return <StyledCategoryView>
      {category?.mods.map((mod:string, index:number) => <CategoryItem key={index} modId={mod}/>)}
    </StyledCategoryView>
};

export default CategoryView;
