import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { MdPlayCircleOutline } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';

interface profile {
  name:string;
};

const StyledList = styled.div`
  display: flex;
  padding: 15px;
  height: 100%;
  width: 100%;
  gap: 15px;
  flex-wrap: wrap;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 200px;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  border-bottom: 1px solid #ccc;
  user-select: none;
`;
const StyledIconContainer = styled.div`
  display:flex;
  width: 100%;
  min-height: 120px;
  justify-content: center;
  align-items: end;
`;
const StyledIcon = styled.div`
  position: relative;
  height: 90px;
  width: 90px;
  img {
    width: 100%;
    height: 100%;
  }
`;
const StyledAddButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
  opacity: .6;
  transition: opacity ease .5s;
  svg {
    width: 70px;
    height: 70px;
    color: #3D327B;
  }
  &:hover {
    opacity: 1;
    transition: opacity ease .2s;
  }
`;
const StyledPlayButton = styled.div`
  background: rgba(0,0,0,.6);
  border: none;
  outline: none;
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity ease .5s;

  svg {
    width: 40px;
    height: 40px;
    color: #fff;
  }
  &:hover {
    opacity: 1;
    transition: opacity ease .2s;
  }
`;
const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 600;
  font-size: 18px;
  padding: 15px;
  color: #3D327B;
`;
const ProfileItem = (({profile}:{profile: profile}) => {
  return (
    <StyledItem>
      <StyledIconContainer>
        <StyledIcon>
          <img src="https://i.pinimg.com/favicons/6f0328727cc2a171f3e4f5c0a3b8ab59ac16781586d037729a07e366.jpg?888ffc27146eb6496b7b168a16060854"/>
          <StyledPlayButton>
            <MdPlayCircleOutline/>
          </StyledPlayButton>
        </StyledIcon>
      </StyledIconContainer>
      <StyledTitle>{profile.name}</StyledTitle>
    </StyledItem>)
});

const ProfilesView = () => {
  const [profiles, setProfiles] = useState([] as profile[]);
  useEffect(() => {
    setProfiles([{name:"SAMP"},{name:"TC Brasil"}]);
  }, []);
  return <StyledList>
          {profiles.map((profile:profile, index:number) => (
            <ProfileItem key={`item-${index}`} profile={profile} />
          ))}
          <StyledItem>
            <StyledAddButton>
              <AiOutlinePlusCircle/>
            </StyledAddButton>
          </StyledItem>
        </StyledList>
};

export default ProfilesView;
