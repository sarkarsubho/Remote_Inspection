import * as types from "./actionTypes";

const initialState = {
  photos: [],
};

export const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_PHOTO:
      return { ...state, photos: [payload, ...state.photos] };
    case types.DELETE_PHOTO:
      let updatedPhotos = state.photos.filter((e) => e._id !== payload);
      return { ...state, photos: updatedPhotos };

    default:
      return state;
  }
};
