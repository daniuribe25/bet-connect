import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton, TextField } from '@material-ui/core';
import Pill from 'components/core/pill';
import { fontMediumLarge } from 'styles/typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useLoginStyles } from 'styles/index';

const Wrapper = styled.div`
  padding: 16px;
`;

const PageTitle = styled.h1`
  ${fontMediumLarge};
`;

const SendButton = styled(Pill)`
  margin-top: 16px;
`;

type SendEmailFormProps = {
  formikProps: any;
};

export const ResetPasswordForm: React.FC<SendEmailFormProps> = (props) => {
  const inputStyles = useLoginStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const {
    formikProps: {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
    },
  } = props;

  return (
    <Wrapper>
      <PageTitle>Change password</PageTitle>
      <TextField
        id="currentPassword"
        label="Current password"
        autoComplete="on"
        type={showOldPassword ? 'text' : 'password'}
        name="currentPassword"
        variant="filled"
        fullWidth
        className={inputStyles.inputCont}
        InputProps={{
          className: inputStyles.input,
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowOldPassword(!showOldPassword)}
              edge="end"
              className={inputStyles.showPassButton}
            >
              {showOldPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
        color="secondary"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.currentPassword}
        style={{ marginTop: 10 }}
        error={errors.currentPassword && touched.currentPassword && true}
        helperText={
          errors.currentPassword &&
          touched.currentPassword &&
          errors.currentPassword
        }
      />
      <TextField
        id="password"
        label="New password"
        autoComplete="on"
        type={showPassword ? 'text' : 'password'}
        name="password"
        variant="filled"
        fullWidth
        className={inputStyles.inputCont}
        InputProps={{
          className: inputStyles.input,
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              className={inputStyles.showPassButton}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
        color="secondary"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        style={{ marginTop: 10 }}
        error={errors.password && touched.password && true}
        helperText={errors.password && touched.password && errors.password}
      />
      <TextField
        id="repeatPassword"
        label="Repeat new password"
        autoComplete="on"
        type={showPassword ? 'text' : 'password'}
        name="repeatPassword"
        variant="filled"
        fullWidth
        className={inputStyles.inputCont}
        InputProps={{
          className: inputStyles.input,
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              className={inputStyles.showPassButton}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
        color="secondary"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.repeatPassword}
        style={{ marginTop: 10 }}
        error={errors.repeatPassword && touched.repeatPassword && true}
        helperText={
          errors.repeatPassword &&
          touched.repeatPassword &&
          errors.repeatPassword
        }
      />

      <SendButton variant="success" onClick={handleSubmit}>Confirm</SendButton>
    </Wrapper>
  );
};

export default ResetPasswordForm;
