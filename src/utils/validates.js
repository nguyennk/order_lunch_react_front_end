import isPast from 'date-fns/is_past';

const required = value => (value ? undefined : 'This field is required.');

const appropriateBirthday = value =>
  isPast(value) ? undefined : 'Please select a date in the past.';

const appropriateEmail = value =>
  /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value) ? undefined : 'Please provide a valid email';

export { required, appropriateBirthday, appropriateEmail };
