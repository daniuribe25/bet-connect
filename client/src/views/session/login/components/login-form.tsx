import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton, TextField } from '@material-ui/core';
import Pill from 'components/core/pill';
import { fontMediumLarge } from 'styles/typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useLoginStyles } from 'styles/index';

const PageTitle = styled.h1`
  ${fontMediumLarge};
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
`;

const LoginButton = styled(Pill)`
  margin-top: 8px;
`;

type LoginFormProps = {
  formikProps: any;
};

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const styles = useLoginStyles();
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <PageTitle>Log in</PageTitle>
      <TextField
        id="phone"
        label="Email or Phone number"
        autoComplete="on"
        variant="filled"
        type="text"
        name="phone"
        fullWidth
        className={styles.inputCont}
        InputProps={{ className: styles.input }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.phone}
        error={errors.phone && touched.phone && true}
        helperText={errors.phone && touched.phone && errors.phone}
      />
      <TextField
        id="password"
        label="Password"
        autoComplete="on"
        type={showPassword ? 'text' : 'password'}
        name="password"
        variant="filled"
        fullWidth
        className={styles.inputCont}
        color="secondary"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        style={{ marginTop: 10 }}
        error={errors.password && touched.password && true}
        helperText={errors.password && touched.password && errors.password}
        InputProps={{
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              className={styles.showPassButton}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
          className: styles.input,
        }}
      />
      <LoginButton variant="info" onClick={handleSubmit}>
        Log in
      </LoginButton>
    </Wrapper>
  );
};

export default LoginForm;
