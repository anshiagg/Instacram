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

    follow_someone(auth_token) {
        console.log("in follow someone");
        return fetch(`${this.url}/user/follow?username=Wyatt`, {
            method : 'PUT',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }) 
    }

    follow(auth_token, username) {
        return fetch(`${this.url}/user/follow?username=${username}`, {
            method : 'PUT',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        })  
    }

    unfollow(auth_token, username) {
        return fetch(`${this.url}/user/unfollow?username=${username}`, {
            method : 'PUT',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        })  
    }
    /**
     * @returns feed array in json format
     */
    getFeed(auth_token) {
        console.log("in get feed");
        return fetch(`${this.url}/user/feed`, {
            method : 'GET',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }).then(response => response.json())
    
    }

    getCustomFeed(auth_token, start) {
        console.log("in get custom feed");
        return fetch(`${this.url}/user/feed?p=${start}`, {
            method : 'GET',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }).then(response => response.json())


    }

    /**
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
    /**
     *  @returns the list of users in JSON format
     */
    getUsers() {
        fetch (`${this.url}/dummy/user`, {
            method : 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
    }

    /**
     * @param {object} user
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

    /*
    * @param {object} user
    */
   register(user) {
    return fetch(`${this.url}/auth/signup`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
        method : 'POST',
        //body : JSON.parse(`{"username" : "${user.username}", "password": "${user.password}"}`)
        body : JSON.stringify(user)
    }).then(response => response.json())
   }

   like_post(post, auth_token) {
    console.log(auth_token);
    return fetch(`${this.url}/post/like?id=${post}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization': `Token ${auth_token}`},
        method : 'PUT',
    }).then(response => console.log(response))
   }

   unlike_post(post, auth_token) {
    console.log(auth_token);
    return fetch(`${this.url}/post/unlike?id=${post}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization': `Token ${auth_token}`},
        method : 'PUT',
    }).then(response => console.log(response))
   }

   getUser(auth_token, id) {
    return fetch (`${this.url}/user/?id=${id}`, {
        method : 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` }
    }).then(response => response.json())
   }

   getUserByUsername(auth_token, username) {
    return fetch (`${this.url}/user/?username=${username}`, {
        method : 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` }
    }).then(response => response.json())   
   }

   make_comment(auth_token, comment, id) {
    return fetch (`${this.url}/post/comment?id=${id}`, {
        method : 'PUT',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Token ${auth_token}` },
        body: JSON.stringify(comment)
    }).then(response => response.json())
   }

   make_post(auth_token, post) {
    return fetch(`${this.url}/post/`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'POST',
        body : JSON.stringify(post)
    }).then(response => response.json())
   }

   get_post(auth_token, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'GET',
    }).then(response => response.json())
   }

   update_post(auth_token, post, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'PUT',
        body : JSON.stringify(post)
    })
   }
   update_user(auth_token, update) {
    return fetch(`${this.url}/user/`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'PUT',
        body: JSON.stringify(update)
    }).then(response => response.json())
   }
   delete_post(auth_token, id) {
    return fetch(`${this.url}/post/?id=${id}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' , 'Authorization' : `Token ${auth_token}`},
        method : 'DELETE',
    })
   }

}
