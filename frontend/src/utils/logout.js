// utils/logout.js
export function handleLogout(navigate) {
  localStorage.clear();
  navigate('/login');
}