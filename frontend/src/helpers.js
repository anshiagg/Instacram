import {renderFeed} from './main.js';
import API from './api.js';

/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

export function createLoginForm() {
    const section = createElement('section', null, {class : 'login', id : 'login'});
    section.appendChild(createElement('h4', 'Login form', { class: 'login-title' }));
    const myForm = createElement('div', null, {class : 'form'});

    myForm.appendChild(createElement('label', 'Username:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter username here', required : null, id: 'name'} ));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Password:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter password here', required : null, id: 'pass'} ));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('button', 'Login', {type: 'submit', id: 'submit'}));
    const register = createElement('a', 'Not yet a member?', {id : 'register-link', href : '#'});
    register.addEventListener('click', createRegisterForm);
    myForm.appendChild(register);
    section.appendChild(myForm);
    return section;
}

function createRegisterForm() {
    const main = document.getElementById('large-feed');
    if (document.getElementById('login') != null) {
        main.removeChild(document.getElementById('login'));
    }
    const section = createElement('section', null, {class : 'register', id : 'register'});
    section.appendChild(createElement('h4', 'Registration form', { class: 'title' }));
    const myForm = createElement('div', null, {class : 'form'});
    myForm.appendChild(createElement('label', 'Username:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    var uname = createElement('input', null, {type: 'text', placeholder: 'Enter username here', id: 'name'});
    uname.required = true;
    myForm.appendChild(uname);
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Name:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    var name = createElement('input', null, {type: 'text', placeholder: 'Enter name here', id: 'real_name'} );
    name.required = true;
    myForm.appendChild(name);
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Password:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    var password = createElement('input', null, {type: 'text', placeholder: 'Enter password here', id : 'pass'});
    password.required = true;
    myForm.appendChild(password);
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Email:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    var email = createElement('input', null, {type: 'text', placeholder: 'Enter email here', id : 'email'});
    email.required = true;
    myForm.appendChild(email);
    myForm.appendChild(createElement('br', null));
    const button = createElement('button', 'Register', {type: 'submit', id: 'register-button'});
    myForm.appendChild(button);
    button.addEventListener('click', register);
    section.appendChild(myForm);
    main.appendChild(section);
    console.log(uname);
    console.log(name);
    console.log(email);
    console.log(password);

}



function register(e) {

    // First, we get all the fields
    var username = document.getElementById('name').value;
    var name = document.getElementById('real_name').value;
    var password = document.getElementById('pass').value;
    var email = document.getElementById('email').value;

    // Now, for some error checking, first check if all fields are filled up
    if (username == "" || name == "" || password == "" || email == "") {

        // Got this from stack overflow, to delete all error classes
        var paras = document.getElementsByClassName('error');
        while(paras[0]) 
            paras[0].parentNode.removeChild(paras[0]);

        if (!document.getElementById('register-empty-error')) {
            const section = createElement('div', 'Please fill in all fields', {class : 'error', id : 'register-empty-error'});
            const form = document.getElementById('register');
            form.appendChild(section);
            return;
        }
    }

    // Next, check if the email is valid
	const pattern = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z0-9A-Z]+/i;
	if (!(pattern.exec(email))) {
        var paras = document.getElementsByClassName('error');
        while(paras[0]) 
            paras[0].parentNode.removeChild(paras[0]);

        if (!document.getElementById('register-email-error')) {
            const section = createElement('div', 'Please enter a valid email (A@A.A)', {class : 'error', id : 'register-email-error'});
            const form = document.getElementById('register');
            form.appendChild(section);
            return;
        }
    }

    // Remove all errors if any
    var paras = document.getElementsByClassName('error');
    while(paras[0]) 
        paras[0].parentNode.removeChild(paras[0]);

    // Now, we are going to make our user object
    const user = {};
    user.username = username;
    user.password = password;
    user.email = email;
    user.name = name;
    console.log(user);

    // Then, we make a call to the API
    const api = new API();
    api.register(user).then(json => {
        const tok = json.token;
        if (tok == undefined) {
            var paras = document.getElementsByClassName('error');
            while(paras[0]) 
                paras[0].parentNode.removeChild(paras[0]);

            if (!document.getElementById('register-username-error')) {
                const section = createElement('div', 'Username already taken', {class : 'error', id : 'register-username-error'});
                const form = document.getElementById('register');
                form.appendChild(section);
                return;
            }
        }
        window.localStorage.setItem('status', 'loggedIn');
        renderFeed(tok);
        console.log("WE HERE");

    });


}
/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,' + post.src, alt: post.meta.description_text, class: 'post-image' }));

    section.appendChild(createElement('div', post.meta.likes.length + ' likes', {class : 'likes'}));
    section.appendChild(createElement('p', post.meta.description_text, {class : 'post-description'}));

    section.appendChild(createElement('time', post.meta.published, {class :'post-time', datetime : post.meta.published }));
    section.appendChild(createElement('div', post.comments.length + ' comments', {class : 'post-comments'}));

    return section;
}

function getFormattedDate(date) {
    return date.match('[a-zA-Z]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}');
 //   return date.match('[a-zA-Z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}');
}
// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/


export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null
}

export function getDetails(event) {
    const username = document.getElementById('name').value;
    const password = document.getElementById('pass').value;
    var user = {};
    user["username"] = username;
    user["password"] = password;
    //console.log(user);
    const api = new API();
    api.authenticate(user)
    .then(response => {
        console.log(response);
        const tok = response.token;
        if (tok === undefined) {
            if (!document.getElementById('login-error')) {
                const section = createElement('div', 'Wrong username/password', {class : 'error', id : 'login-error'});
                const form = document.getElementById('login');
                form.appendChild(section);
            }
        } else {
            window.localStorage.setItem('status', 'loggedIn');
            renderFeed(tok);
            console.log("WE HERE");
        }

    });

    /*
    if (checkStore(username) == null) {
        if (!document.getElementById('login-error')) {
            const section = createElement('div', 'Wrong username', {class : 'error', id : 'login-error'});
            const form = document.getElementById('login');
            form.appendChild(section);
        }
        */

       // window.localStorage.setItem('current', checkStore(username));
    
}

export function logout(e) {
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