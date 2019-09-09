import {
  FETCH_PLAYERS_SUCCESS,
  ADD_PLAYER_SUCCESS,
  EDIT_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

function mergePlayers(state, { players }) {
  const newState = { ...state };
  players.forEach(player => {
    newState[player.id] = player;
  });
  return newState;
}

function editPlayer(state, player) {
  const newState = { ...state };
  newState[player.id] = player;
  return newState;
}

function deletePlayer(state, player) {
  const newState = { ...state };
  delete newState[player.id];
  return newState;
}

export default function players(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return mergePlayers(state, action.payload.data);
    case ADD_PLAYER_SUCCESS:
    case EDIT_PLAYER_SUCCESS:
      return editPlayer(state, action.payload.data);
    case DELETE_PLAYER_SUCCESS:
      return deletePlayer(state, action.payload.data);
    default:
      return state;
  }
}
