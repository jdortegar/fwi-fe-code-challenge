import { FETCH_PLAYERS_SUCCESS, ADD_PLAYER_SUCCESS } from './constants';

function mergePlayers(state, { players }) {
  const newState = { ...state };
  players.forEach(player => {
    newState[player.id] = player;
  });
  return newState;
}

function addPlayer(state, player) {
  const newState = { ...state };
  newState[player.id] = player;
  return newState;
}

export default function players(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return mergePlayers(state, action.payload.data);
    case ADD_PLAYER_SUCCESS:
      debugger;
      return addPlayer(state, action.payload.data);
    default:
      return state;
  }
}
