import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import {MdDragHandle} from 'react-icons/md';
import IconButton from '@material-ui/core/IconButton';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { styled as muiStyled } from '@material-ui/core/styles';
import { AiFillFolderOpen } from 'react-icons/ai';

interface mod {
  name:string;
  type:string;
};

const StyledList = styled.ul`
  width: 100%;
`;

const StyledDragIcon = styled(MdDragHandle)``;
const StyledItem = styled.li`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  user-select: none;

  ${StyledDragIcon} {
    width: 25px;
    height: 25px;
    color: #ccc;
    cursor: row-resize;
    margin-right: 20px;
  }
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
const StyledTexts = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyledButtons = styled.div`
  min-width: 100px;
`;
const IOSSwitch = muiStyled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
const DragHandle = SortableHandle(() => <StyledDragIcon/>);

const SortableItem = SortableElement(({mod}:{mod: mod}) => {
  const [active, setActive] = useState(true);

  const onCheck = () => {
    setActive(!active);
    window.api.send("ModController.setIgnore", {mod: mod.name, ignore: active});
  }
  const openFolder = () => {
    window.api.send("ModController.openModFolder", mod.name);
  }

  return (
    <StyledItem>
      <DragHandle/>
      <StyledTexts>
        <StyledTitle>{mod.name}</StyledTitle>
        <StyledDescription>{mod.type}</StyledDescription>
      </StyledTexts>
      <StyledButtons>
        <IconButton onClick={openFolder}>
          <AiFillFolderOpen/>
        </IconButton>
        <IOSSwitch checked={active} onChange={onCheck}/>
      </StyledButtons>
    </StyledItem>)});

const SortableList = SortableContainer(({mods}:{mods: mod[]}) =>
    <StyledList>
      {mods.map((mod:any, index:number) => (
        <SortableItem key={`item-${index}`} index={index} mod={mod} />
      ))}
    </StyledList>
);

const ModsView = () => {
  const [mods, setMods] = useState([] as mod[]);
  useEffect(() => {
      window.api.send("ModController.getMods", {});
      window.api.receive("ModController.receiveModList", (modList:any) => {
        setMods(modList);
      });
  }, []);
  const onSortEnd = ({oldIndex, newIndex} : {oldIndex: number, newIndex:number}) => {
    const newArray = arrayMoveImmutable(mods, oldIndex, newIndex);
    window.api.send("ModController.reorderList", newArray.map(mod => mod.name));
    setMods(newArray);
  };
  return <SortableList mods={mods} onSortEnd={onSortEnd} lockAxis="y" useDragHandle/>
};

export default ModsView;
