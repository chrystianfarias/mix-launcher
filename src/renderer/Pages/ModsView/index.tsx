import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import {MdDragHandle} from 'react-icons/md';

interface mod {
  name:string;
  type:string;
};

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  user-select: none;

  svg {
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
`;
const DragHandle = SortableHandle(() => <MdDragHandle/>);

const SortableItem = SortableElement(({mod}:{mod: mod}) =>
    <StyledItem>
      <DragHandle/>
      <StyledTexts>
        <StyledTitle>{mod.name}</StyledTitle>
        <StyledDescription>{mod.type}</StyledDescription>
      </StyledTexts>
    </StyledItem>);

const SortableList = SortableContainer(({mods}:{mods: mod[]}) =>
    <ul>
      {mods.map((mod:any, index:number) => (
        <SortableItem key={`item-${index}`} index={index} mod={mod} />
      ))}
    </ul>
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
    setMods(arrayMoveImmutable(mods, oldIndex, newIndex));
  };
  return <SortableList mods={mods} onSortEnd={onSortEnd} lockAxis="y" useDragHandle/>
};

export default ModsView;
