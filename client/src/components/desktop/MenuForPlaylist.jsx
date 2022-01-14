import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { ReactComponent as PlaylistIcon } from '../../images/playlists.svg';

const PlaylistContainer = styled.div`
  flex: 388 388 auto;
  max-width: 38.8rem;
  background: rgba(242, 231, 218, 0.6);
  box-shadow: 0.3rem 0.3rem 0.4rem rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
`;

const PlaylistMenuNav = styled.div`
  margin: 1.2rem auto 2.8rem auto;
  max-width: 32.1rem;
  display: flex;
  align-items: center;
`;

const Circle = styled.div`
  flex: 64 64 auto;
  max-width: 6.4rem;
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  background: #f7f2ed;
  box-shadow: 0 0.4rem 0.4rem rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavGhostDiv = styled.div`
  flex: 32 32 auto;
  max-width: 3.2rem;
`;

const NavTitle = styled.div`
  flex: 223 223 auto;
  max-width: 22.3rem;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const WithEmptyPlaylist = styled.div`
  max-width: 26.6rem;
  margin: 0 auto 1rem auto;
  font-style: normal;
  font-weight: bold;
  font-size: 23px;
  color: rgba(85, 85, 85, 0.8);
  cursor: pointer;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const MenuForPlaylist = () => {
  return (
    <PlaylistContainer>
      <PlaylistMenuNav>
        <Circle>
          <PlaylistIcon width={34.4} height={34.4} />
        </Circle>
        <NavGhostDiv />
        <NavTitle>저장된 플레이리스트</NavTitle>
      </PlaylistMenuNav>
      <WithEmptyPlaylist>빈 플레이리스트로 시작</WithEmptyPlaylist>
    </PlaylistContainer>
  );
};

export default MenuForPlaylist;
