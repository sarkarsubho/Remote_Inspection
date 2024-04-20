import * as types from "./actionTypes";

export const addToAlbum = (photo) => (dispatch) => {
  dispatch({ type: types.ADD_PHOTO, payload: photo });
};
export const deleteFromAlbum = (_id) => (dispatch) => {
  dispatch({ type: types.DELETE_PHOTO, payload: _id });
};
