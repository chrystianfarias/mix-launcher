import styled from 'styled-components';

const StyledCategoryItem = styled.div`
  display: flex;
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  margin-bottom: 0;
  border-radius: 8px;
`;

const StyledImage = styled.img`
  object-fit: cover;
  width: 90px;
  height: 90px;
`;

const StyledTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  color: #3D327B;
`;

const StyledTexts = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryItem = () => {
  return <StyledCategoryItem>
    <StyledImage src={"https://2.bp.blogspot.com/--CCgn0RdWXw/W3k46SqRK6I/AAAAAAAATCY/5sPahyGvQPciRJ4tHLSKZ8qaPnp1U49AwCK4BGAYYCw/s400/gta-sa-debug-kit-xbox.jpg"}/>
    <StyledTexts>
      <StyledTitle>A maior perda da história do modding de GTA SA</StyledTitle>
    </StyledTexts>
  </StyledCategoryItem>
};

export default CategoryItem;
