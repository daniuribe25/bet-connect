import { RegisterFormValues } from './register';
import { LoginFormValues } from './login';
import { ResetPasswordFormValues } from '../reset-password/reset-password';
import { PasswordFormValues } from './components/password-step';

type SendEmailFormValues = {
  email?: string;
};

export const loginValidation = (values: LoginFormValues): LoginFormValues => {
  const errors: LoginFormValues = {};
  const phone = values.phone?.replace('+', '');
  if (!phone) {
    errors.phone = 'Email or Phone number required';
  } else if (/^\d+$/.test(phone) && phone?.length < 8) {
    errors.phone = 'Invalid phone number';
  } else if (
    !/^\d+$/.test(phone) &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(phone)
  ) {
    errors.phone = 'Invalid email or phone number';
  }
  if (!values.password) {
    errors.password = 'Password required';
  }
  return errors;
};

export const resetPasswordValidation = (
  values: ResetPasswordFormValues,
): ResetPasswordFormValues => {
  const errors: ResetPasswordFormValues = {};
  if (!values.currentPassword) {
    errors.currentPassword = 'Current Password required';
  }
  if (!values.password) {
    errors.password = 'New Password required';
  }
  if (!values.repeatPassword) {
    errors.repeatPassword = 'Repeat Password required';
  }
  if (
    values.password &&
    values.repeatPassword &&
    values.repeatPassword !== values.password
  ) {
    errors.repeatPassword = 'Both passwords have to match';
  }
  return errors;
};

export const emailValidation = (
  values: SendEmailFormValues,
): SendEmailFormValues => {
  const errors: SendEmailFormValues = {};
  if (!values.email) {
    errors.email = 'Email required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email';
  }
  return errors;
};

export const passwordStepValidation = (
  values: PasswordFormValues,
): PasswordFormValues => {
  const errors: any = {};
  if (!values.password) {
    errors.password = 'Password required';
  } else if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/.test(
      values.password,
    ) &&
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/.test(values.password)
  ) {
    errors.password = 'Please use a valid password';
  }
  return errors;
};

export const registerValidation = (
  values: RegisterFormValues,
): RegisterFormValues => {
  const errors: RegisterFormValues = {};
  if (!values.phone) {
    errors.phone = 'Phone required';
  } else if (values.phone.length < 8) {
    errors.phone = 'Invalid phone';
  }
  if (!values.password) {
    errors.password = 'Password required';
  }
  if (!values.phone) {
    errors.phone = 'Phone required';
  }
  if (values.phone && values.phone.includes('_')) {
    errors.phone = 'Not a valid Phone';
  }
  if (!values.password_confirmation) {
    errors.password_confirmation = 'Confirm Password required';
  }
  if (values.password_confirmation !== values.password) {
    errors.password_confirmation = "Passwords don't match";
  }

  return errors;
};
