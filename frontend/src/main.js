// importing named exports we use brackets
import { createLoginForm,update, follow, closeFollowModal, unfollow, closeUnFollowModal, closeUpdate, makeProfile, postImage, closePosts, getDetails, logout, randomInteger, createPostTile, uploadImage, checkStore, createElement } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';
var startNumber;
export function renderFeed(auth_token) {
    window.localStorage.setItem('current', auth_token);
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
    const logOut = createElement('a', 'Log out', {id : 'logout', class : 'topnav-item', href : '#'});
    logOut.addEventListener('click', logout);
    navbar.appendChild(logOut);
    // we can use this single api request multiple times
    api.getMe(auth_token).then((json) => {
        console.log(json);
        window.localStorage.setItem('cur_user', json.username);
        const profile = createElement('a', `Me`, {class : 'topnav-item', href : '#'});
        profile.addEventListener('click',(event) => makeProfile(auth_token));
        navbar.appendChild(profile);
    });
    const posting = createElement('a', 'Post', {class : 'topnav-item', href : '/#'});
    posting.addEventListener('click', (event) => postImage(event, auth_token));
    const close = document.getElementsByClassName("close")[2];
    close.addEventListener('click', closePosts);
    navbar.appendChild(posting);
    const updateInfo = createElement('a', 'Update profile', {class : 'topnav-item', href : '/#'});
    updateInfo.addEventListener('click', () => update(auth_token));
    const closeUp = document.getElementsByClassName("close")[3];
    closeUp.addEventListener('click', closeUpdate);
    navbar.appendChild(updateInfo);
    
    const followSomeone = createElement('a', 'Follow', {class : 'topnav-item', href : '/#'});
    followSomeone.addEventListener('click', () => follow(auth_token));
    const closeFollow = document.getElementsByClassName("close")[4];
    closeFollow.addEventListener('click', closeFollowModal);
    navbar.appendChild(followSomeone);


    const unfollowSomeone = createElement('a', 'Unfollow', {class : 'topnav-item', href : '/#'});
    unfollowSomeone.addEventListener('click', () => unfollow(auth_token));
    const closeUnFollow = document.getElementsByClassName("close")[4];
    closeUnFollow.addEventListener('click', closeUnFollowModal);
    navbar.appendChild(unfollowSomeone);

    const closeUpdatePosts = document.getElementsByClassName("close")[5];
    closeUpdatePosts.addEventListener('click', () => {
        const modal = document.getElementById('updatePostsModal');
        modal.style.display = 'none';
    });
    
    const homeLink = document.getElementById('home');
    homeLink.addEventListener('click',() => makeHome(auth_token));

    //const followed = api.follow_someone(auth_token)
    //const liked = api.like_post(95,auth_token);
    /*
    const comment = {};
    comment.author = 'Sophia';
    comment.published = (new Date()).getTime() / 1000;
    comment.comment = 'I love you!';
    
    console.log(comment.published);
    */
    //const commented = api.make_comment(auth_token, comment, 95);
    makeHome();
}

function makeHome() {
    // Got this code off stack overflow, and modified to remove all posts under large-feed
    console.log("Got this code for make home"); 
    const auth_token = checkStore('current');
    startNumber = 0;
    var myFeed = document.getElementById("large-feed");
    while (myFeed.firstChild) {
        myFeed.removeChild(myFeed.firstChild);
    }
    const api = new API();
    const feed = api.getFeed(auth_token);
    Promise.all([feed])
    .then(posts => posts[0].posts.sort((a,b) =>  new Date(b.meta.published) - new Date(a.meta.published)))
    .then(posts => {
        console.log(posts);
        posts.reduce((parent, post) => {
    
            parent.appendChild(createPostTile(post, auth_token));
            console.log(post.id);
            return parent;

        }, document.getElementById('large-feed'))  
    })
    .catch(err => console.log('Some error occurred', err));
    //window.addEventListener('scroll', checkLoadMore);
    setInterval(checkLoadMore, 2000);
}

export function checkLoadMore() {
    //if (flag == true) return;

    if (document.getElementById('profile-username')) return;
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

        console.log("Scroll percent exceeded");
        const api = new API();
        startNumber += 10;
        const feed = api.getCustomFeed(auth_token, startNumber);
        console.log(auth_token + " " + startNumber);
        console.log()
        Promise.all([feed])
        .then(posts => posts[0].posts.sort((a,b) =>  new Date(b.meta.published) - new Date(a.meta.published)))
        .then(posts => {
            //startNumber += posts.length;
            if (posts.length == 0) return;
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
//window.localStorage.setItem('status', 'loggedOut');

if (checkStore('status') === 'loggedOut') {
   var main = document.getElementById('large-feed');
   const form = createLoginForm();
   main.appendChild(createLoginForm());
   const button = document.getElementById('submit');
   console.log(button);
   button.addEventListener('click', getDetails);
} else {
    renderFeed(checkStore('current'));

    // Potential example to upload an image
    //const input = document.querySelector('input[type="file"]');

//    input.addEventListener('change', uploadImage);
}


