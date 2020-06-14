import { InjectionToken } from '@angular/core';

export interface ErrorMessages {
  [error: string]: string;
}

export const MESSAGES: ErrorMessages = Object.freeze({
  required: 'This field is required',

  passwordComplexity: `Your password needs to be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter \
and 1 number`,
  passwordAllowedCharacters: `You have entered at least one character that is not allowed. Please change your password and try again`,
  passwordMaxLength: `Your password exceeds maximum length of 128 characters. Please change your password and try again`,
  passwordConfirmation: `The passwords you entered don't match. Please re-enter.`,
  currentPassword: 'The password you entered is incorrect, please re-enter it',

  phone: 'Please enter a valid phone number (i.e. 555-555-5555)',

  email: 'The email address is invalid. Please reenter it (i.e.name@domain.com)',

  userName: 'This field accepts a-z A-Z space and (\', -) symbols',

  maxlength: 'This field should not be longer than ',
  pattern: 'Invalid field format',
});

export const ERROR_MESSAGES = new InjectionToken<ErrorMessages>('ERROR_MESSAGES');
