import {
  FETCH_PLAYERS_SUCCESS,
  ADD_PLAYER_SUCCESS,
  EDIT_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

export function fetchPlayersSuccess(data) {
  return { type: FETCH_PLAYERS_SUCCESS, payload: { data } };
}

export function addPlayerSuccess(data) {
  return { type: ADD_PLAYER_SUCCESS, payload: { data } };
}

export function editPlayerSuccess(data) {
  return { type: EDIT_PLAYER_SUCCESS, payload: { data } };
}

export function deletePlayerSuccess(data) {
  return { type: DELETE_PLAYER_SUCCESS, payload: { data } };
}
