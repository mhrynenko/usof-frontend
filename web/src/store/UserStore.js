import { makeAutoObservable } from "mobx"

export default class UserStore {
    constructor(auth = false, user = {}) {
        this._isAuth = auth
        this._user = user
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(usr) {
        this._user = usr;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    } 
}