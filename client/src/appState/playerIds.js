import {
  FETCH_PLAYERS_SUCCESS,
  ADD_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

function addPlayerId(state, player) {
  return [player.id, ...state];
}

function deletePlayerId(state, player) {
  const newState = state.filter(payerId => payerId !== player.id);
  return newState;
}

export default function playerIds(state = [], action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return action.payload.data.players.map(player => player.id);
    case ADD_PLAYER_SUCCESS:
      return addPlayerId(state, action.payload.data);
    case DELETE_PLAYER_SUCCESS:
      return deletePlayerId(state, action.payload.data);
    default:
      return state;
  }
}
