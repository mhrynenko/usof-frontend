import { $host } from ".";
import { LOGIN_ROUTE, LOGOUT_ROUTE, REGISTER_ROUTE, USER_AVATAR_ROUTE, USER_ROUTE } from "../utils/consts";

export const signUP = async (login, email, password, password_confirm) => {
    const {data} = await $host.post(REGISTER_ROUTE, 
        {login, email, password, password_confirm}
    )
    return data;
}

export const signIN = async (login, email, password) => {
    const {data} = await $host.post(LOGIN_ROUTE, 
        {login, email, password}
    )
    return data;
}

export const signOUT = async () => {
    const { data } = await $host.post(LOGOUT_ROUTE)
    return data;
}

export const getOneUser = async (id) => {
    const { data } = await $host.get(USER_ROUTE.replace(':user_id', id))
    return data;
}


export const updateOneUserAvatar = async (userData) => {
    const { data } = await $host.patch(USER_AVATAR_ROUTE, userData)
    return data;
}

export const updateOneUserData = async (id, login, full_name, email) => {
    const { data } = await $host.patch(USER_ROUTE.replace(':user_id', id), {
        login, full_name, email,
    })
    return data;
}

export const getOneUserAvatar = async (login) => {
    const { data } = await $host.get(USER_AVATAR_ROUTE, {params: {login : login}})
    return data;
}