// importing named exports we use brackets
import { createLoginForm, getDetails, logout, randomInteger, createPostTile, uploadImage, checkStore, createElement } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

export function renderFeed(auth_token) {
    const login = document.getElementById('login');
    if (login != null) {
        const main = document.getElementById('large-feed');
        main.removeChild(login);
    }
    const register = document.getElementById('register');
    if (register != null) {
        const main = document.getElementById('large-feed');
        main.removeChild(register);
    }

    const navbar = document.getElementById('nav');
    const logOut = createElement('li', null, {});
    logOut.appendChild(createElement('a', 'Log out', {id : 'logout', href : '#'}));
    logOut.addEventListener('click', logout);
    navbar.appendChild(logOut);
    // we can use this single api request multiple times
    api.getMe(auth_token).then((json) => {
        console.log(json);
        navbar.appendChild(createElement('li', `Welcome ${json.name}!`, {}))}
    );
    const followed = api.follow_someone(auth_token)
    const feed = api.getFeed(auth_token);
    Promise.all([feed, followed])
    .then(posts => {
        console.log(posts[0].posts);
        posts[0].posts.reduce((parent, post) => {
    
            parent.appendChild(createPostTile(post));
            console.log("Here in reduce");
            return parent;

        }, document.getElementById('large-feed'))  
    })
    .catch(err => console.log('Some error occurred', err));
}

const api  = new API();
/*
const users = api.getUsers();

users.
    then(userList => {
        for (var i in userList) {
            console.log(userList[i]);
            window.localStorage.setItem(userList[i].username, userList[i].name );
        }
    });
    */
window.localStorage.setItem('status', 'loggedOut');

if (checkStore('status') === 'loggedOut') {
   var main = document.getElementById('large-feed');
   const form = createLoginForm();
   main.appendChild(createLoginForm());
   const button = document.getElementById('submit');
   console.log(button);
   button.addEventListener('click', getDetails);
} else {
    renderFeed();

    // Potential example to upload an image
    //const input = document.querySelector('input[type="file"]');

//    input.addEventListener('change', uploadImage);
}


