import Auth from "./pages/Auth"
import PostPage from "./pages/PostPage"
import Posts from "./pages/Posts"
import Settings from "./pages/Settings"
import { LOGIN_ROUTE, POSTS_ROUTE, POST_ROUTE, REGISTER_ROUTE, SETTINGS_ROUTE, USERS_ROUTE, USER_ROUTE, } from "./utils/consts"

export const authRoutes = [
    {
        path : USERS_ROUTE,
        Component : 'USERS'
    },
    {
        path : USER_ROUTE,
        Component : 'USER'
    }
]

export const publicRoutes = [
    {
        path : POSTS_ROUTE,
        Component : Posts
    },
    {
        path : POST_ROUTE,
        Component : PostPage
    },
    {
        path : REGISTER_ROUTE,
        Component : Auth
    },
    {
        path : LOGIN_ROUTE,
        Component : Auth
    },
    {
        path : SETTINGS_ROUTE,
        Component : Settings
    }
]