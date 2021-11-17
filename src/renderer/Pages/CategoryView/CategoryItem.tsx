import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsDownload, BsCheck } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import api from "../../Services/api";
import LanguageContext from 'renderer/Context/LanguageContextProvider';
import StyledRoundedButton from 'renderer/Components/RoundedButton';
import Mod from 'Models/Mod';
import Skeleton from '@material-ui/core/Skeleton';

interface ImageProp {
  isLoading: boolean;
}

const StyledCategoryItem = styled.div`
  display: flex;
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  margin-bottom: 0;
  border-radius: 8px;
  align-items: center;
`;

const StyledImage = styled.div`
  width: 90px;
  height: 90px;
  min-width: 90px;
`;
const StyledThumbnail = styled.img<ImageProp>`
  object-fit: contain;
  width: 100%;
  height: 100%;
  display: ${(props => props.isLoading ? "block" : "none")};
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
  modId: string
}
const CategoryItem: React.FC<CategoryItemViewProps> = ({
  modId
}) => {
  const language = useContext(LanguageContext)
  const [ mod, setMod ] = useState<Mod>()
  const [ progress, setProgress ] = useState({status: "pending", progress:0, message:""});
  const [ imgLoaded, setImgLoaded ] = useState(false);

  const getMod = async () => {
    let response = await api.get(modId);
    let mod = response.data;
    mod.name = modId;
    setMod(response.data);
  };

  useEffect(() => {
    getMod();
  }, []);

  const installButtonClick = () => {
    window.api.send("ModController.installMod", mod);
    window.api.receive("ModDownload." + mod?.name, (progress:any) => {
      setProgress(progress);
    });
  };

  const renderStatus = (status:string) =>
  {
    switch (status)
    {
      case "pending":
        return <StyledButton onClick={installButtonClick}>
                 <BsDownload/>
               </StyledButton>;
      case "Download":
        return <span>{progress.progress}%</span>;
      case "Error":
        return <BiErrorCircle color="#e74c3c" size={30}/>;
      case "Complete":
        return <BsCheck color="#2ecc71" size={30}/>;
    }
    return <></>;
  }

  const onLoadImage = () => {
    setImgLoaded(true);
  }

  const renderMod = () => {
    return <StyledCategoryItem>
    <StyledImage>
      <StyledThumbnail isLoading={imgLoaded} key={mod?.thumbnail} src={mod?.thumbnail} onLoad={onLoadImage}/>
      {imgLoaded?<></>:<Skeleton animation="wave" variant="rectangular" width={90} height={90} />}
    </StyledImage>
    <StyledTexts>
      <StyledTitle>{mod?.languages[language.state].name}</StyledTitle>
      <StyledDescription>
      {mod?.languages[language.state].description}
      </StyledDescription>
    </StyledTexts>
    <StyledButtons>
      {renderStatus(progress.status)}

    </StyledButtons>
  </StyledCategoryItem>;
  }

  const renderLoader = () => {
    return <StyledCategoryItem>
      <StyledImage>
        <Skeleton animation="wave" variant="rectangular" width={90} height={90} />
      </StyledImage>
      <StyledTexts>
        <StyledTitle>
          <Skeleton animation="wave" variant="text"/>
        </StyledTitle>
        <StyledDescription>
          <Skeleton animation="wave" variant="rectangular" width={250} height={40} />
        </StyledDescription>
      </StyledTexts>
      <StyledButtons>
      </StyledButtons>
    </StyledCategoryItem>
  };

  return mod ? renderMod() : renderLoader();
};

export default CategoryItem;
