import { useContext } from 'react';
import styled from 'styled-components';
import MainView from '../../Pages/MainView';
import ModsView from '../../Pages/ModsView';
import Sidebar from '../../Components/Sidebar';
import Header from '../../Components/Header';
import PageContext from '../../Context/PageContextProvider';
import CategoryView from '../../Pages/CategoryView';
import SettingsView from '../../Pages/SettingsView';

const MainContainer = styled.div`
  background-color: #EBEBEB;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: auto;
  scrollbar-color: #3D327B #EBEBEB;

  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3D327B;
    border-radius: 10px;
    border: 6px solid #EBEBEB;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-shrink: 1;
`;

const MainPage = () => {

  const GetPage = () => {
    const {state} = useContext(PageContext)
    switch(state.page){
      case "main":
        return <MainView/>;
      case "mods":
        return <ModsView/>;
      case "settings":
        return <SettingsView/>
      default:
        return <CategoryView category={state.category}/>
    }
  };
  return (
    <MainContainer>
      <Sidebar/>
      <ContentContainer>
        <Header/>
        <PageContainer>
          {GetPage()}
        </PageContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default MainPage;
