import React from 'react';
import { Field } from 'redux-form';
import {
    FlatButton,
    ReduxFormTextField,
} from '@ehrocks/react-velonic';
import {
    appropriateEmail,
    required,
} from '../../../../../utils/validates';

const processErrorMessage = err => {
    if (!err.name)
        return '';
    return `${err.name}: ${err.message}`;
}

const PureForm = ({
    handleSubmit,
    loginError,
    valid,
    isFetching,
}) => (
        <form onSubmit={handleSubmit}>
            <Field
                id="email"
                name="email"
                label="Email"
                type="text"
                component={ReduxFormTextField}
                validate={appropriateEmail}
            />
            <Field
                id="password"
                name="password"
                label="Password"
                component={ReduxFormTextField}
                type="password"
                validate={required}
            />
            <FlatButton type="primary"
                onClick={handleSubmit}
                label="Login"
                disabled={!valid || isFetching ? true : false}
                style={{
                    width: '100%',
                    marginTop: '20px',
                    backgroundColor: '#599EC2',
                    borderColor: '#599EC2'
                }} />

            <span className='error'>{loginError ? processErrorMessage(loginError) : ''}</span>
        </form>
    )

export default PureForm;