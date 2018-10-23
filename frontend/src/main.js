// importing named exports we use brackets
import { createLoginForm, getDetails,  randomInteger, createPostTile, uploadImage, checkStore, createElement } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

export function renderFeed() {
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
    const curUser = createElement('li',`Welcome ${window.localStorage.getItem('current')}!` , {});
    const logOut = createElement('li', null, {});
    logOut.appendChild(createElement('a', 'Log out', {id : 'logout', href : '#'}));
    logOut.addEventListener('click', logout);
    navbar.appendChild(curUser);
    navbar.appendChild(logOut);
    // we can use this single api request multiple times
    const feed = api.getFeed();

    feed
    .then(posts => posts.sort(function(a,b) {return new Date(b.meta.published) - new Date(a.meta.published)}))
    .then(posts => {
        posts.reduce((parent, post) => {

            parent.appendChild(createPostTile(post));
            return parent;

        }, document.getElementById('large-feed'))
    })
    .catch(err => console.log('Some error occured', err));

}

function logout(e) {
    window.localStorage.setItem('status', 'loggedOut');
    var main = document.getElementById('large-feed');
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
    const navbar = document.getElementById('nav');
    while (navbar.firstChild) {
        navbar.removeChild(navbar.firstChild);
    }
    const form = createLoginForm();
    main.appendChild(createLoginForm());
    const button = document.getElementById('submit');
    console.log(button);
    button.addEventListener('click', getDetails);

}
const api  = new API();
const users = api.getUsers();

users.
    then(userList => {
        for (var i in userList) {
            console.log(userList[i]);
            window.localStorage.setItem(userList[i].username, userList[i].name );
        }
    });
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


