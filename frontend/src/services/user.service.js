const axios = require('axios');
import * as firebase from 'firebase/app'

const BASE_URL =
  process.env.NODE_ENV !== 'development' ? '' : '//localhost:3000';

export default {
  login,
  logout,
  getLoggedInUser,
  getById,
  signUpUser,
  getPicUrl,
  firebaseLogin,
  firebaseLogOut,
  getGProvider,
  getFProvider,
  firebaseOnAuthStateChanged
};

async function login({ userName, password }) {
  const res = await axios.put(`${BASE_URL}/login`, { userName, password })
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

function signUpUser(user) {
  return axios.post(`${BASE_URL}/signup`, user);
}
const CLOUDINARY_URL = ' https://api.cloudinary.com/v1_1/do6zqbr29/upload'
const CLOUDINARY_UPLOAD_PRESET = 'enr75skp'
async function getPicUrl(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
  return Promise.resolve(res.data.secure_url)
}


function firebaseLogin(provider) {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
    })
    .catch(function (error) {
    });
}


function firebaseLogOut() {
  firebase.auth().signOut()
}

function getGProvider() {
  return new firebase.auth.GoogleAuthProvider()
}

function getFProvider() {
  return new firebase.auth.FacebookAuthProvider();
}

function firebaseOnAuthStateChanged(store,emit) {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userName = user.displayName;
        const pic = user.photoURL;
        const _id = user.uid;
        store.commit({
          type: "setLoggedInUser",
          user: { userName, pic, _id }
        });
        emit("onLogin");
      } 
    });
}