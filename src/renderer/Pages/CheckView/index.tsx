import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Skeleton from '@material-ui/core/Skeleton';
import { BiError, BiLinkExternal } from 'react-icons/bi';
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from 'react-icons/ai';

interface ItemProps {
  error:any;
}
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  user-select: none;
`;
const StyledItem = styled.div`
  display: flex;
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  margin-bottom: 0;
  border-radius: 8px;
  align-items: center;
`;
const StyledTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  color: #3D327B;
`;

const StyledDescription = styled.span`
  opacity: .7;
  font-size: 14px;
  margin-top: 15px;
`;
const StyledTexts = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
`;
const StyledButtons = styled.div`
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Link = styled.button`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Item: React.FC<ItemProps> = ({
  error
}) => {
  let title = error.message;
  let description = error.description;
  let icon = "warning";
  let link = "";
  if (title.includes("exe"))
  {
    title = "Executável inválido"
    link = "https://www.mixmods.com.br/2021/09/primeiros-passos-para-montar-um-gta-modificado/";
  }
  if (description.includes("notrecommended"))
  {
    icon = "error";
    description = "O executável atual não é recomendado, utilize o hoodlum."
    link = "https://www.mixmods.com.br/2021/09/primeiros-passos-para-montar-um-gta-modificado/";
  }
  if (title.includes("missing"))
  {
    title = "Arquivo não encontrado"
    icon = "error";
    description = `O arquivo "${description}" não foi encontrado.`
  }
  if (title.includes("modified"))
  {
    title = "Arquivo modificado"
    description = `O arquivo "${description}" foi modificado fora do modloader.`
  }
  const openLink = () => {
    window.api.send("App.link", link);
  }
  return <StyledItem>
    {icon == "warning"
    ?<BiError size={40} color="#f39c12"/>
    :<AiOutlineCloseCircle color="#e74c3c" size={40}/>}
    <StyledTexts>
      <StyledTitle>
        {title}
      </StyledTitle>
      <StyledDescription>
        {description}
      </StyledDescription>
    </StyledTexts>
    {link != ""
      ?<StyledButtons>
        <Link onClick={openLink}>Saiba mais <BiLinkExternal/></Link>
      </StyledButtons>
      :<></>}

  </StyledItem>;
};
const LoadingItem = () => {
  return <StyledItem>
    <StyledTexts>
      <StyledTitle>
        <Skeleton animation="wave" variant="text"/>
      </StyledTitle>
      <StyledDescription>
        <Skeleton animation="wave" variant="rectangular" width={250} height={40} />
      </StyledDescription>
    </StyledTexts>
  </StyledItem>;
};

const CheckView = () => {
  const [errors, setErrors] = useState([] as any[]);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
      window.api.send("GameController.checkGame", {});
      window.api.receive("GameController.receiveCheckGame", (errors:any[]) => {
        setErrors(errors);
        setChecking(false);
      });
  }, []);

  return <StyledContainer>
      {checking ? [...Array(4)].map(() => <LoadingItem/>)
        :errors.length > 0
        ?errors.map(error => <Item error={error}/> )
        :<StyledItem>
          <AiOutlineCheckCircle color="#2ecc71" size={40}/>
          <StyledTexts>
            <StyledTitle>
              Tudo certo com seu jogo!
            </StyledTitle>
            <StyledDescription>
              Verificamos todos os arquivos do jogo, parece estar tudo ok.
            </StyledDescription>
          </StyledTexts>
        </StyledItem> }
    </StyledContainer>;
}
export default CheckView;
