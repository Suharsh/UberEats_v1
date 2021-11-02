/* eslint-disable no-param-reassign */
import * as actions from '../actions/actionsTypes';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actions.LOGIN:
      state = {
        ...state,
        user: action.payload,
      };
      console.log('inside reducer', state);
      break;
    case actions.LOGOUT:
      state = {};
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
