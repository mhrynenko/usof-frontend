import { makeAutoObservable } from "mobx"

export default class PostStore {
    constructor(posts = [], comments = [], likes = [], categories = []) {
        this._posts = posts
        this._comments = comments
        this._likes = likes
        this._categories = categories
        this._page = 1
        this._pageAmount = 0
        this._limit = 5
        makeAutoObservable(this);
    }

    setPosts(posts) {
        this._posts = posts;
    }

    setComments(comments) {
        this._comments = comments;
    }

    setLikes(comments) {
        this._comments = comments;
    }

    setCategories(categories) {
        this._categories = categories;
    }

    setPage(page) {
        this._page = page;
    }

    setPageAmount(pagesAmount) {
        this._pageAmount = pagesAmount;
    }

    setLimit(limit) {
        this._limit = limit;
    }

    get posts() {
        return this._posts;
    }

    get comments() {
        return this._comments;
    } 

    get likes() {
        return this._likes;
    } 

    get categories() {
        return this._categories;
    } 

    get page() {
        return this._page;
    } 

    get pageAmount() {
        return this._pageAmount;
    } 

    get limit() {
        return this._limit;
    } 
}