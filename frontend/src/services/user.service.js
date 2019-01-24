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
  getPicUrl
};

async function login({ userName, password }) {
  const res = await axios.put(`${BASE_URL}/login`, { userName, password })
  console.log('login data',res.data)
  sessionStorage.loggedInUser = JSON.stringify(res.data);
  return res.data;
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
  console.log('user service signing user up',user)
  return axios.post(`${BASE_URL}/signup`, user);
}
const CLOUDINARY_URL = ' https://api.cloudinary.com/v1_1/do6zqbr29/upload'
const CLOUDINARY_UPLOAD_PRESET = 'enr75skp'
async function getPicUrl(file) {
  const data = new FormData()
    data.append('file',file)
    data.append('upload_preset',CLOUDINARY_UPLOAD_PRESET)

    const res = await axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    })
    console.log(res)
    return Promise.resolve(res.data.secure_url)
}