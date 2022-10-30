import { $host } from ".";
import { COMMENT_LIKES_ROUTE, COMMENT_ROUTE } from "../utils/consts";


export const getOneCommentLikes = async (id) => {
    const { data } = await $host.get(COMMENT_LIKES_ROUTE.replace(':comment_id', id));
    return data;
}

export const createOneCommentLike = async (id, type) => {
    const { data } = await $host.post(COMMENT_LIKES_ROUTE.replace(':comment_id', id), {
        type : type
    });
    return data;
}

export const deleteOneCommentLike = async (id) => {
    const { data } = await $host.delete(COMMENT_LIKES_ROUTE.replace(':comment_id', id));
    return data;
}

export const deleteOneComment = async (id) => {
    const { data } = await $host.delete(COMMENT_ROUTE.replace(':comment_id', id));
    return data;
}

export const changeOneComment = async (id, userData) => {
    const { data } = await $host.patch(COMMENT_ROUTE.replace(':comment_id', id), userData);
    return data;
}