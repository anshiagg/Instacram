// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:5000'

const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 

    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

    /**
     * Code to follow someone
     * @param {string} auth_token
     * @param {string} username
     * @returns whether the follow was successful
     */
    follow(auth_token, username) {
        return fetch(`${this.url}/user/follow?username=${username}`, {
            method : 'PUT',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        })  
    }

    /**
     * Code to unfollow someone
     * @param {string} auth_token
     * @param {string} username
     * @returns whether the unfollow was successful
     */
    unfollow(auth_token, username) {
        return fetch(`${this.url}/user/unfollow?username=${username}`, {
            method : 'PUT',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        })  
    }
    /** Code to get feed of user pointed to by auth_token
     * @param authorizationToken
     * @returns feed array in json format
     */
    getFeed(auth_token) {
        console.log("in get feed");
        return fetch(`${this.url}/user/feed`, {
            method : 'GET',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }).then(response => response.json())
    
    }
    /** Code to get a feed starting from a set number 
     * @param auth_token
     * @param start number for feed
     * @returns feed array in json format
     */
    getCustomFeed(auth_token, start) {
        console.log("in get custom feed");
        return fetch(`${this.url}/user/feed?p=${start}`, {
            method : 'GET',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }).then(response => response.json())


    }

    /** Code to get the user pointed to by the auth_token
     * @param authorization_token
     * @returns auth'd user in json format
     */
    getMe(auth_token) {
        console.log("in get me");
        return fetch(`${this.url}/user/`, {
            method : 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization':  `Token ${auth_token}`}
        }).then(response => 
            response.json()
        )
    }


    /** Code to login the user whose data is in user object
     * @param {object} user
     * @returns the user auth_token of logged in user
     */
    authenticate(user) {
        console.log(user);
        return fetch(`${this.url}/auth/login`, {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
            method : 'POST',
            //body : JSON.parse(`{"username" : "${user.username}", "password": "${user.password}"}`)
            body : JSON.stringify(user)
        }).then(response => response.json())
    }

    /** Code to register the user using data in the user object
    * @param {object} user
    * @returns the authorization token of the registered user
    */
   register(user) {
    return fetch(`${this.url}/auth/signup`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
        method : 'POST',
        //body : JSON.parse(`{"username" : "${user.username}", "password": "${user.password}"}`)
        body : JSON.stringify(user)
    }).then(response => response.json())
   }

    /** Code to like the post pointed to by id post, by the user pointed to by auth_token
    * @param {object} post
    * @param {string} auth_token
    * @returns whether or not the like was successful
    */
   like_post(post, auth_token) {
    console.log(auth_token);
    return fetch(`${this.url}/post/like?id=${post}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization': `Token ${auth_token}`},
        method : 'PUT',
    }).then(response => console.log(response))
   }

    /** Code to unlike the post pointed to by id post, by the user pointed to by auth_token
    * @param {object} post
    * @param {string} auth_token
    * @returns whether or not the unlike was successful
    */
   unlike_post(post, auth_token) {
    console.log(auth_token);
    return fetch(`${this.url}/post/unlike?id=${post}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization': `Token ${auth_token}`},
        method : 'PUT',
    }).then(response => console.log(response))
   }
    /** Code to get a user pointed to by the ID
    * @param {string} auth_token
    * @param {int} id
    * @returns the user object pointed to by ID
    */
   getUser(auth_token, id) {
    return fetch (`${this.url}/user/?id=${id}`, {
        method : 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` }
    }).then(response => response.json())
   }

    /** Code to get a user by their username 
    * @param {string} auth_token
    * @param {string} username
    * @returns the user object pointed to by username
    */
   getUserByUsername(auth_token, username) {
    return fetch (`${this.url}/user/?username=${username}`, {
        method : 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` }
    }).then(response => response.json())   
   }

    /**  Code to make comment on post pointed to by id using data in comment object
    * @param {string} auth_token
    * @param {object} comment
    * @param {int} id
    * @returns whether or not the commenting was successful
    */
   make_comment(auth_token, comment, id) {
    return fetch (`${this.url}/post/comment?id=${id}`, {
        method : 'PUT',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` },
        body: JSON.stringify(comment)
    }).then(response => response.json())
   }

    /**  Code to make a new post using data in the post object
    * @param {string} auth_token
    * @param {object} post
    * @returns the post id of new post
    */
   make_post(auth_token, post) {
    return fetch(`${this.url}/post/`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'POST',
        body : JSON.stringify(post)
    }).then(response => response.json())
   }

    /** Code to fetch the post pointed to by id
    * @param {string} auth_token
    * @param {int} id
    * @returns the post pointed to by id
    */
   get_post(auth_token, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'GET',
    }).then(response => response.json())
   }

    /** Code to update the post pointed to by id
    * @param {string} auth_token
    * @param {int} id
    * @returns whether or not the update was successful
    */
   update_post(auth_token, post, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'PUT',
        body : JSON.stringify(post)
    })
   }

    /** Code to update the user pointed to by auth_token using data in update object
    * @param {string} auth_token
    * @param {object} update
    * @returns whether or not the update was successful
    */
   update_user(auth_token, update) {
    return fetch(`${this.url}/user/`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'PUT',
        body: JSON.stringify(update)
    }).then(response => response.json())
   }

    /** Code to delete the post pointed to by id
    * @param {string} auth_token
    * @param {int} id
    * @returns whether or not the delete was successful
    */
   delete_post(auth_token, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'DELETE',
    })
   }

}
