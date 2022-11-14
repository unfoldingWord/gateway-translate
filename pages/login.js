import React, { useState } from 'react';
import useEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  TextField,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
// import { useStyles } from './useStyles';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', remember: '' });
  const { username, password, remember } = formData;

  let user
  let errorText='error text'
  let actionText='action text'

  const updateFormData = (event) => {
    const {
      type, name, value, checked,
    } = event.target;
    const _formData = { ...formData };

    if (type === 'checkbox') _formData[value] = checked;
    else _formData[name] = value;

    setFormData(_formData);
  };

  const onSubmit = (event) => {
    console.log("login() onSubmit() event:", event)
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <LockOutlined />
      <Typography component="h1" variant="h5">
        {(user) ? user.full_name : actionText}
      </Typography>
      {errorText ? (
        <Typography data-test="login-error-text" component="p" style={{ color: 'red' }}>
          {errorText}
        </Typography>) : <></>}
      <form >
        <TextField data-test="username-input" name="username" type="text" label="Username" required
          variant="outlined" margin="normal" fullWidth autoComplete="username"
          disabled={!!user} defaultValue={username}
          onChange={updateFormData}
        />
        <TextField data-test="password-input" name="password" type="password" label="Password" required
          variant="outlined" margin="normal" fullWidth autoComplete="current-password"
          disabled={!!user}
          onChange={updateFormData}
        />
        <FormControlLabel
          data-test="remember-checkbox"
          label="Keep me logged in"
          control={
            <Checkbox color="primary" value="remember" disabled={!!user} checked={remember}
              id={'remember-' + Math.random()} onChange={updateFormData} />
          }
        />
        <Button data-test={user ? 'logout-button' : 'submit-button'} type="button" fullWidth variant="contained"
          color='primary'
          onClick={() => onSubmit(formData)}>
          {(user) ? 'Logout' : actionText}
        </Button>
      </form>
    </div >
  );
};

// LoginForm.propTypes = {
//   /** Configuration to use for sign up/forgot password flow */
//   config: PropTypes.shape({ server: PropTypes.string.isRequired }),
//   /** Callback function to propogate the username and password entered. */
//   onSubmit: PropTypes.func.isRequired,
//   /** The text to describe the action of logging in. */
//   actionText: PropTypes.string,
//   /** The text to describe the error when Authentication fails. */
//   errorText: PropTypes.string,
//   /** The authenticated user object */
//   authentication: PropTypes.shape({ user: PropTypes.object }),
// };

// LoginForm.defaultProps = { actionText: 'Login' };

export default LoginPage
