// importing named exports we use brackets
import { createLoginForm, createRegisterForm, update, follow, closeFollowModal, unfollow, closeUnFollowModal, closeUpdate, makeProfile, showPublicProfile, postImage, closePosts, getDetails, logout, randomInteger, createPostTile, uploadImage, checkStore, createElement } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

// This is a global variable I use for infinite scrolling
var startNumber;
var loadFlag = false;
// Main function which creates the home page first time user logs in
export function renderFeed(auth_token) {

    // Set the current authorisation token
    window.localStorage.setItem('current', auth_token);

    const api = new API();

    // Remove all login and register DOM elements if present
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

    // Code to make the navBar, and its appropriate event listeners
    const navbar = document.getElementById('nav');
    const logOut = createElement('a', 'Log out', {id : 'logout', class : 'topnav-item', href : '#login'});
    logOut.addEventListener('click', logout);
    navbar.appendChild(logOut);

    // I also add the current user's username to the local storage, which is useful
    api.getMe(auth_token).then((json) => {
        console.log(json);
        window.localStorage.setItem('cur_user', json.username);
        const profile = createElement('a', `Me`, {class : 'topnav-item', href : '#'});
        profile.addEventListener('click',(event) => makeProfile(auth_token));
        navbar.appendChild(profile);
    });

    // Post link
    const posting = createElement('a', 'Post', {class : 'topnav-item', href : `/#profile=${checkStore('cur_user')}`});
    posting.addEventListener('click', (event) => postImage(event, auth_token));
    const close = document.getElementsByClassName("close")[2];
    close.addEventListener('click', closePosts);
    navbar.appendChild(posting);

    // Updating profile link
    const updateInfo = createElement('a', 'Update profile', {class : 'topnav-item', href: `/#profile=${checkStore('cur_user')}`});
    updateInfo.addEventListener('click', () => update(auth_token));
    const closeUp = document.getElementsByClassName("close")[3];
    closeUp.addEventListener('click', closeUpdate);
    navbar.appendChild(updateInfo);
    
    // Following someone link
    const followSomeone = createElement('a', 'Follow', {class : 'topnav-item', href : `/#profile=${checkStore('cur_user')}`});
    followSomeone.addEventListener('click', () => follow(auth_token));
    const closeFollow = document.getElementsByClassName("close")[4];
    closeFollow.addEventListener('click', closeFollowModal);
    navbar.appendChild(followSomeone);

    // Unfollowing someone link
    const unfollowSomeone = createElement('a', 'Unfollow', {class : 'topnav-item', href : `/#profile=${checkStore('cur_user')}`});
    unfollowSomeone.addEventListener('click', () => unfollow(auth_token));
    const closeUnFollow = document.getElementsByClassName("close")[4];
    closeUnFollow.addEventListener('click', closeUnFollowModal);
    navbar.appendChild(unfollowSomeone);


    const closeUpdatePosts = document.getElementsByClassName("close")[5];
    closeUpdatePosts.addEventListener('click', () => {
        const modal = document.getElementById('updatePostsModal');
        modal.style.display = 'none';
    });
    
    // Link to home page on instagram logo
    const homeLink = document.getElementById('home');
    homeLink.addEventListener('click',() => makeHome(auth_token));

    makeHome();
}

// Function which actually adds the feed to the home page
function makeHome() {

    var current = window.location.href;
    window.location.href = current.replace(/#(.*)$/, '') + '#feed';
    // Got this code off stack overflow, and modified to remove all posts under large-feed
    loadFlag = false;
    const auth_token = checkStore('current');
    startNumber = 0;
    var myFeed = document.getElementById("large-feed");
    while (myFeed.firstChild) {
        myFeed.removeChild(myFeed.firstChild);
    }

    // Make a new API and add first 10 posts
    const api = new API();
    const feed = api.getFeed(auth_token);
    Promise.all([feed])
    .then(posts => posts[0].posts.sort((a,b) =>  new Date(b.meta.published) - new Date(a.meta.published)))
    .then(posts => {
        console.log(posts);
        startNumber += posts.length;
        posts.reduce((parent, post) => {
            parent.appendChild(createPostTile(post, auth_token));
            console.log(post.id);
            return parent;

        }, document.getElementById('large-feed'))  
    })
    .catch(err => console.log('Some error occurred', err));

    // Checks every 1 second if needs to show more posts
    setInterval(checkLoadMore, 400);
}

export function checkLoadMore() {

    // Only does this for feed page
    if (document.getElementById('profile-username')) return;
    console.log("We in here");
    const auth_token = checkStore('current');
    var top = window.scrollY;
    var windowHeight = window.innerHeight;

    // Found this code off stack overflow, to find document height
    var body = document.body,
    html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    var bodyHeight = height - windowHeight;
    var scrollPercentage = (top / bodyHeight);
    console.log(top + " " + windowHeight +  " " + height + " " + bodyHeight + " " + scrollPercentage);

    // if the scroll is more than 90% from the top, load more content.
    if(scrollPercentage > 0.8) {

        //Logic to load the next 10 or so posts
        const api = new API();

        const feed = api.getCustomFeed(auth_token, startNumber);
        console.log(auth_token + " " + startNumber);
        console.log()
        feed
        .then(posts => posts.posts.sort((a,b) =>  new Date(b.meta.published) - new Date(a.meta.published)))
        .then(posts => {
            if (posts.length == 0) return;
            if (document.getElementById(`post-${posts[0].id}`)) return;
            startNumber += posts.length;
            console.log(posts);
            posts.reduce((parent, post) => {
                parent.appendChild(createPostTile(post, auth_token));
                console.log(post.id);
                return parent;
    
            }, document.getElementById('large-feed'))  
        })
        .catch(err => console.log('Some error occurred', err));
        
    }
}   

var hash = window.location.href.split('#')[1] || '';
const profilePattern = /^profile=/i;
console.log(hash);
if (hash == 'login') {
    logout();
} else if (hash =='register') {
    window.localStorage.setItem('status', 'loggedOut');
    createRegisterForm();
} else if (checkStore('status') == 'loggedOut') {
    var main = document.getElementById('large-feed');
    const form = createLoginForm();
    main.appendChild(createLoginForm());
    const button = document.getElementById('submit');
    console.log(button);
    button.addEventListener('click', getDetails);
} else if (profilePattern.exec(hash)) {
    const username = hash.replace(profilePattern, '');
    const auth_token = checkStore('current');
    console.log(username);
    const api = new API();
    api.getUserByUsername((checkStore('current'), username )).then((response) => {
        if (response) {

            // Remove all login and register DOM elements if present
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
        
            // Code to make the navBar, and its appropriate event listeners
            const navbar = document.getElementById('nav');
            const logOut = createElement('a', 'Log out', {id : 'logout', class : 'topnav-item', href : '#login'});
            logOut.addEventListener('click', logout);
            navbar.appendChild(logOut);
        
            // I also add the current user's username to the local storage, which is useful
            api.getMe(auth_token).then((json) => {
                console.log(json);
                window.localStorage.setItem('cur_user', json.username);
                const profile = createElement('a', `Me`, {class : 'topnav-item', href : `#profile=${checkStore('cur_user')}`});
                profile.addEventListener('click',(event) => makeProfile(auth_token));
                navbar.appendChild(profile);
            });
        
            // Post link
            const posting = createElement('a', 'Post', {class : 'topnav-item', href : `#profile=${checkStore('cur_user')}`});
            posting.addEventListener('click', (event) => postImage(event, auth_token));
            const close = document.getElementsByClassName("close")[2];
            close.addEventListener('click', closePosts);
            navbar.appendChild(posting);
        
            // Updating profile link
            const updateInfo = createElement('a', 'Update profile', {class : 'topnav-item', href : `#profile=${checkStore('cur_user')}`});
            updateInfo.addEventListener('click', () => update(auth_token));
            const closeUp = document.getElementsByClassName("close")[3];
            closeUp.addEventListener('click', closeUpdate);
            navbar.appendChild(updateInfo);
            
            // Following someone link
            const followSomeone = createElement('a', 'Follow', {class : 'topnav-item', href : `#profile=${checkStore('cur_user')}`});
            followSomeone.addEventListener('click', () => follow(auth_token));
            const closeFollow = document.getElementsByClassName("close")[4];
            closeFollow.addEventListener('click', closeFollowModal);
            navbar.appendChild(followSomeone);
        
            // Unfollowing someone link
            const unfollowSomeone = createElement('a', 'Unfollow', {class : 'topnav-item', href : `#profile=${checkStore('cur_user')}`});
            unfollowSomeone.addEventListener('click', () => unfollow(auth_token));
            const closeUnFollow = document.getElementsByClassName("close")[4];
            closeUnFollow.addEventListener('click', closeUnFollowModal);
            navbar.appendChild(unfollowSomeone);
        
        
            const closeUpdatePosts = document.getElementsByClassName("close")[5];
            closeUpdatePosts.addEventListener('click', () => {
                const modal = document.getElementById('updatePostsModal');
                modal.style.display = 'none';
            });
            
            // Link to home page on instagram logo
            const homeLink = document.getElementById('home');
            homeLink.addEventListener('click',() => makeHome(auth_token));
        
            if (checkStore('cur_user') == username) {
                makeProfile(checkStore('current'));
            } else {
                showPublicProfile(auth_token, username);
            }
        } else {
            renderFeed(checkStore('current'));
        }
    })
} else {
    renderFeed(checkStore('current'));
}


