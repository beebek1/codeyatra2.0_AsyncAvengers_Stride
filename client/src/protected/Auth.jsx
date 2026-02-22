import { auth } from "../services/firebase";

// Save token after login
export const setToken = (token) => localStorage.setItem("token", token);

// Get token
export const getToken = () => localStorage.getItem("token");

// Remove token
export const clearToken = () => localStorage.removeItem("token");

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

// Check login status
export const isLoggedIn = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

// Login (email/password)
export const loginWithEmail = async (email, password) => {
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  const token = await userCredential.user.getIdToken();
  setToken(token);
  return userCredential.user;
};

// Logout
export const logout = async () => {
  await auth.signOut();
  clearToken();
};