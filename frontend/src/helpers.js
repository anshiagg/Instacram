import {renderFeed} from './main.js';

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
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter password here', required : null} ));
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
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter username here', required : null, id: 'name'} ));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Name:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter name here', required : null, id: 'real_name'} ));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('label', 'Password:', {class : 'labels'}));
    myForm.appendChild(createElement('br', null));
    myForm.appendChild(createElement('input', null, {type: 'text', placeholder: 'Enter password here', required : null} ));
    myForm.appendChild(createElement('br', null));
    const button = createElement('button', 'Register', {type: 'submit', id: 'register-button'});
    myForm.appendChild(button);
    button.addEventListener('click', register);
    section.appendChild(myForm);
    main.appendChild(section);

}



function register(e) {
    const user = {};
    user.username = document.getElementById('name').value;
    user.name = document.getElementById('real_name').value;
    user.posts = [];
    const p1 = fetch ('./data/users.json')
        .then(response => response.json())
        .then(json => {
            user.id = json.length + 1;  
        })


    if (checkStore(user.username) != null) {
        if (!document.getElementById('register-error')) {
            const section = createElement('div', 'Username already exists', {class : 'error', id : 'register-error'});
            const form = document.getElementById('register');
            form.appendChild(section);
        }
    } else {
        window.localStorage.setItem('status', 'loggedIn');
        window.localStorage.setItem('current', user.name);
        window.localStorage.setItem(user.username, user.name);
        renderFeed();
        console.log("WE HERE");
    }

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
        { src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    section.appendChild(createElement('div', post.meta.likes.length + ' likes', {class : 'likes'}));
    section.appendChild(createElement('p', post.meta.description_text, {class : 'post-description'}));

    section.appendChild(createElement('time', getFormattedDate(post.meta.published), {class :'post-time', datetime : post.meta.published }));
    section.appendChild(createElement('div', post.meta.comments.length + ' comments', {class : 'post-comments'}));

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
    console.log(username);
    if (checkStore(username) == null) {
        if (!document.getElementById('login-error')) {
            const section = createElement('div', 'Wrong username', {class : 'error', id : 'login-error'});
            const form = document.getElementById('login');
            form.appendChild(section);
        }
    } else {
        window.localStorage.setItem('status', 'loggedIn');
        window.localStorage.setItem('current', checkStore(username));
        renderFeed();
        console.log("WE HERE");
    }
    
}