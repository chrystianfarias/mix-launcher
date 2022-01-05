import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import Mod from 'Models/Mod';

interface InstallModalProps {
  onClose:any;
  mod:Mod;
}
const Background = styled.div`
  background: rgba(0,0,0,.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;
const Container = styled.div`
  position: relative;
  border-radius: 6px;
  width: 85%;
  height: 75%;
  padding: 25px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  &:last-child {
    margin-bottom: 0;
  }
`;
const CloseButton = styled.button`
  border: none;
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  height: 40px;
  width: 40px;
  outline: none;
  -webkit-app-region: no-drag;
  transition: ease .3s background;
  border-radius: 5px;
  cursor: pointer;

  svg {
    width: 30px;
    height: 30px;
    color: #000;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  height: 40px;
  color: #3D327B;
`;

const MixPost = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  line-height: 1.4;
  b {
    font-weight: 700;
  }
  ul {
    margin-left: 20px;
    list-style: square;
  }
  div {
    margin-bottom: 10px;
  }
`;

const InstallModal: React.FC<InstallModalProps> = ({
  onClose,
  mod
}) => {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    fetch(mod.post)
      .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
      })
      .then(function(html) {
          // Initialize the DOM parser
          var parser = new DOMParser();

          // Parse the text
          var doc = parser.parseFromString(html, "text/html");

          var post = doc.getElementsByClassName("entry-content");
          if (post.length > 0)
          {
            var related = post[0].getElementsByClassName("crp_related  ");
            if (related.length > 0)
              related[0].remove();
            setPage(post[0].innerHTML);
          }
      })
      .catch(function(err) {
          console.log('Failed to fetch page: ', err);
      });
  }, [])

  return <Background>
        <Container>
        <CloseButton onClick={onClose}>
          <IoIosClose/>
        </CloseButton>
        <Title>{mod.package}</Title>
        <MixPost dangerouslySetInnerHTML={{ __html: page }}/>
      </Container>
    </Background>;
}
export default InstallModal;
