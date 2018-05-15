// const token = localStorage.getItem('id_token') || null
export const Authorized = token => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});
