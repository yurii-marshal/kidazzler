import { ContactUsSubject } from './contact-us-subject';

export interface ContactUsMessage {
  email: string;
  firstName: string;
  lastName: string;
  subject: ContactUsSubject;
  message: string;
  recaptchaResponse: string;
}
