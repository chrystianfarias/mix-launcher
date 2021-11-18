import styled, { keyframes } from 'styled-components';
import { flipInX } from 'react-animations';
const flipAnimation = keyframes`${flipInX}`;

const Title = styled.h1`
  animation: 1s ${flipAnimation};
  color: #fff;
  font-size: 80px;
  font-weight: 100;
  text-shadow: 0 0 10px black;
  span {
    font-size: 12px;
  }
`;

export default Title;
