
import CategoryItem from "./CategoryItem";
import styled from 'styled-components';
import Category from "Models/Category";
import backImage from '../../../../assets/go-away.jpg';

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

const GoWayBackground = styled.div`
  width: 100%;
  height: 100%;
  background: url(${backImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    width: 200px;
    font-size: 26px;
    text-align: center;
    color: #fff;
    margin-left: 50%;
  }
`;


const CategoryView: React.FC<CategoryViewProps> = ({
  category
}) => {
    if (category?.mods.length == 0)
    {
      return <StyledCategoryView>
              <GoWayBackground>
              <p>There are no Mods up here. Go away.</p>
              </GoWayBackground>
            </StyledCategoryView>
    }
    return <StyledCategoryView>
      {category?.mods.map((mod:string) => <CategoryItem key={mod} modId={mod}/>)}
    </StyledCategoryView>
};

export default CategoryView;
