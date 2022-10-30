import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import PostStore from './store/PostStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));

function checkUser () {
  const token = Cookies.get('token')
  let user;

  token !== undefined 
  ? user = new UserStore(true, jwt_decode(token))
  : user = new UserStore()

  return user;
}

root.render(
  <Context.Provider value={{
      user : checkUser(),  
      post : new PostStore(),
    }}>
    <App/>
  </Context.Provider>,
);

