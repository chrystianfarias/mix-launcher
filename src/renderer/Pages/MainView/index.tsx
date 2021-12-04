
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  &:last-child {
    margin-bottom: 0;
  }
`;
const MainView = () => {
    return <Container>
      <iframe id="news" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FFamiliaMixMods&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId=1949651325288961"
      width="100%" height="100%" scrolling="no"></iframe>
    </Container>
};

export default MainView;
