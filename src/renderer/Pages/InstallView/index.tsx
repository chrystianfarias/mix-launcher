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

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  height: 40px;
  color: #3D327B;
`;

const InstallView = () => {
  return <Container>
      <Title>Mod A</Title>
    </Container>;
}
export default InstallView;
