import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import PureForm from './PureForm';

export const FORM_NAME = 'loginForm';

const formConfig = {
    form: FORM_NAME,
    fields: ['email', 'password'],
};

const valueSelector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
    email: valueSelector(state, 'email'),
    password: valueSelector(state, 'password'),
})

const enhance = compose(
    connect(mapStateToProps, null),
    reduxForm(formConfig, mapStateToProps),
    mapProps(
        ({
            handleSubmit,
            loginHandler,
            ...others
        }) => {


            return {
                handleSubmit: handleSubmit(loginHandler),
                ...others,
            };
        }
    )
)
export default enhance(PureForm);
