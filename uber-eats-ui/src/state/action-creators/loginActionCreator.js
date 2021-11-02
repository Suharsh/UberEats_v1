import * as actions from '../actions/actionsTypes';

const setUser = (user) => {
  console.log('inside set user', user);
  return {
    type: actions.LOGIN,
    payload: user,
  };
};

const doLogoutUser = () => ({
  type: actions.LOGOUT,
  payload: {},
});

export { setUser, doLogoutUser as default };
