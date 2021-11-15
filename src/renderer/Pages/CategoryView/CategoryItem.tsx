import { useContext, useState } from 'react';
import styled from 'styled-components';
import { BsDownload } from 'react-icons/bs';
import Mod from 'Models/Mod';
import LanguageContext from 'renderer/Context/LanguageContextProvider';
import StyledRoundedButton from 'renderer/Components/RoundedButton';

const StyledCategoryItem = styled.div`
  display: flex;
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  margin-bottom: 0;
  border-radius: 8px;
  align-items: center;
`;

const StyledImage = styled.img`
  object-fit: contain;
  width: 90px;
  height: 90px;
`;

const StyledTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  color: #3D327B;
`;

const StyledDescription = styled.span`
  opacity: .4;
  font-size: 14px;
  margin-top: 15px;
`;

const StyledButtons = styled.div`
  width: 80px;
  min-width: 80px;
  max-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledTexts = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
`;

const StyledButton = styled(StyledRoundedButton)`
  svg {
    color: #3D327B;
    width: 30px;
    height: 30px;
  }
`;

interface CategoryItemViewProps {
  mod?: Mod
}
const CategoryItem: React.FC<CategoryItemViewProps> = ({
  mod
}) => {
  const language = useContext(LanguageContext)
  const [ progress, setProgress ] = useState(0);

  const installButtonClick = () => {
    window.api.send("ModController.installMod", mod);
    window.api.receive("ModDownload." + mod?.languages["en_us"].name, (progress:number) => {
      setProgress(progress);
    });
  };

  return <StyledCategoryItem>
    <StyledImage src={mod?.thumbnail}/>
    <StyledTexts>
      <StyledTitle>{mod?.languages[language.state].name}</StyledTitle>
      <StyledDescription>
      {mod?.languages[language.state].description}
      </StyledDescription>
    </StyledTexts>
    <StyledButtons>
      {progress}
      <StyledButton onClick={installButtonClick}>
        <BsDownload/>
      </StyledButton>
    </StyledButtons>
  </StyledCategoryItem>
};

export default CategoryItem;
