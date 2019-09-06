import { FETCH_PLAYERS_SUCCESS, ADD_PLAYER_SUCCESS } from './constants';

export function fetchPlayersSuccess(data) {
  return { type: FETCH_PLAYERS_SUCCESS, payload: { data } };
}

export function addPlayerSuccess(data) {
  debugger;
  return { type: ADD_PLAYER_SUCCESS, payload: { data } };
}
