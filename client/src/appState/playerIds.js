import { FETCH_PLAYERS_SUCCESS, ADD_PLAYER_SUCCESS } from './constants';

function addPlayerId(state, player) {
  return [player.id, ...state];
}

export default function playerIds(state = [], action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return action.payload.data.players.map(player => player.id);
    case ADD_PLAYER_SUCCESS:
      return addPlayerId(state, action.payload.data);
    default:
      return state;
  }
}
