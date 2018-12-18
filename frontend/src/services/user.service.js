const axios = require('axios');
const BASE_URL =
  process.env.NODE_ENV !== 'development' ? '' : '//localhost:3000';

// const API_KEY = 'AIzaSyAy0MEnLAI1gBNxTT2DBtw440qGgNzZb8c';
export default {
  login,
  logout,
  getLoggedInUser,
  getById,
  signupUser,
};

function login({ userName, password }) {
  return axios.put(`${BASE_URL}/login`, { userName, password }).then(res => {
    sessionStorage.loggedInUser = JSON.stringify(res.data);
    return res.data;
  });
}

function logout() {
  return axios.post(`${BASE_URL}/logout`).then(() => {
    sessionStorage.removeItem('loggedInUser');
  });
}

function getLoggedInUser() {
  if (!sessionStorage.loggedInUser) return Promise.resolve('');
  return Promise.resolve(JSON.parse(sessionStorage.loggedInUser));
}

function getById(id) {
  if (id) {
    axios.get(`${BASE_URL}/player/${id}`);
    return axios.get(`${BASE_URL}/player/${id}`).then(res => res.data);
  }
}

function signupUser(user) {
  return axios.post(`${BASE_URL}/signup`, user);
}

