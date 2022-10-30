import { $host } from ".";
import { POSTS_ROUTE, POST_COMMENTS_ROUTE, POST_LIKES_ROUTE, POST_ROUTE, POST_STATUS_ROUTE } from "../utils/consts";

export const getPosts = async (page, limit, parametrs) => {
    const {data} = (await $host.get(POSTS_ROUTE, { 
        params : {
            page : page,
            limit : limit,
            byLikes : parametrs.byLikes,
            status : parametrs.status,
            byDate : parametrs.byDate,
            filterCategory : parametrs.filterCategory,
            "filterDateBetween[from]" : parametrs.filterDateBetween.from,
            "filterDateBetween[to]" : parametrs.filterDateBetween.to,
            filterStatus : parametrs.filterStatus,
        }
    }))

    return data;
}

export const getOnePost = async (id) => {
    const { data } = await $host.get(POST_ROUTE.replace(':post_id', id));
    return data;
}

export const deleteOnePost = async (id) => {
    const { data } = await $host.delete(POST_ROUTE.replace(':post_id', id));
    return data;
}

export const createOnePost = async (userData) => {
    const { data } = await $host.post(POSTS_ROUTE, userData,);
    return data;
}

export const changeOnePost = async (id, userData) => {
    const { data } = await $host.patch(POST_ROUTE.replace(':post_id', id), userData);
    return data;
}

export const createOnePostComment = async (id, userData) => {
    const { data } = await $host.post(POST_COMMENTS_ROUTE.replace(':post_id', id), userData);
    return data;
}

export const getOnePostComments = async (id) => {
    const { data } = await $host.get(POST_COMMENTS_ROUTE.replace(':post_id', id));
    return data;
}

export const getOnePostLikes = async (id) => {
    const { data } = await $host.get(POST_LIKES_ROUTE.replace(':post_id', id));
    return data;
}

export const createOnePostLike = async (id, type) => {
    const { data } = await $host.post(POST_LIKES_ROUTE.replace(':post_id', id), {
        type : type
    });
    return data;
}

export const deleteOnePostLike = async (id) => {
    const { data } = await $host.delete(POST_LIKES_ROUTE.replace(':post_id', id));
    return data;
}

export const changeOnePostStatus = async (id) => {
    const { data } = await $host.patch(POST_STATUS_ROUTE.replace(':post_id', id),);
    return data;
}