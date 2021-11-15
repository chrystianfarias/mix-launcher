
import CategoryItem from "./Components/CategoryItem";
import styled from 'styled-components';

interface CategoryViewProps {
  fullInstall: boolean;
}

const StyledCategoryView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  user-select: none;
`;


const CategoryView: React.FC<CategoryViewProps> = ({

}) => {

    return <StyledCategoryView>
      <CategoryItem></CategoryItem>
      <CategoryItem></CategoryItem>
      <CategoryItem></CategoryItem>
      <CategoryItem></CategoryItem>
    </StyledCategoryView>
};

export default CategoryView;
