import makeStateAction from 'redux-state-action';

export const reducerPath = 'UTILS';
export const names = {
    is_open_confirm_modal: 'boolean',
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

export const isOpenConfirmModalSelector = selectorFactory('is_open_confirm_modal');

const setIsOpenConfirmModalAC = actionCreatorFactory('is_open_confirm_modal');

export const setIsOpenConfirmModal = status => dispatch => {
    dispatch(setIsOpenConfirmModalAC(status));
}


