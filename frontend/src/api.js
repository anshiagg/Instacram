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
    /**
     * @returns feed array in json format
     */
    getFeed(auth_token) {
        console.log("in get feed");
        return fetch(`${this.url}/user/feed`, {
            method : 'GET',
            headers: {'Accept' : 'application/json', 'Content-type' : 'application/json', 'Authorization' : `Token ${auth_token}`}
        }).then(response => response.json())
        //.then(json => console.log(json))
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

}
