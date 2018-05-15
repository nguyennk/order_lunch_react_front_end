import makeStateAction from 'redux-state-action';

export const reducerPath = 'UTILS';
export const names = {
  is_open_confirm_order_modal: 'boolean',
  is_open_confirm_logout_modal: 'boolean',
};

export const {
  branch,
  reducer,
  actionTypeFactory,
  actionCreatorFactory,
  selectorFactory,
} = makeStateAction({
  reducerPath,
  names,
});

export const isOpenConfirmOrderModalSelector = selectorFactory('is_open_confirm_order_modal');
export const isOpenConfirmLogoutModalSelector = selectorFactory('is_open_confirm_logout_modal');

const setIsOpenConfirmOrderModalAC = actionCreatorFactory('is_open_confirm_order_modal');
const setIsOpenConfirmLogoutModalAC = actionCreatorFactory('is_open_confirm_logout_modal');

export const setIsOpenConfirmOrderModal = status => dispatch => {
  dispatch(setIsOpenConfirmOrderModalAC(status));
};

export const setIsOpenConfirmLogoutModal = status => dispatch => {
  dispatch(setIsOpenConfirmLogoutModalAC(status));
};
