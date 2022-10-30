export const POSTS_ROUTE = '/api/posts' //GET POST
export const POST_ROUTE = '/api/posts/:post_id' //GET PATCH DELETE
export const POST_STATUS_ROUTE = '/api/posts/:post_id/status' //PATCH 
export const POST_COMMENTS_ROUTE = '/api/posts/:post_id/comments' //GET POST
export const POST_CATEGORIES_ROUTE = '/api/posts/:post_id/categories'
export const POST_LIKES_ROUTE = '/api/posts/:post_id/like' //GET POST DELETE

export const COMMENT_LIKES_ROUTE = '/api/comments/:comment_id/like' //GET POST DELETE
export const COMMENT_ROUTE = '/api/comments/:comment_id' //GET PATCH DELETE

export const REGISTER_ROUTE = '/api/auth/register'
export const LOGIN_ROUTE = '/api/auth/login'
export const LOGOUT_ROUTE = '/api/auth/logout'

export const USERS_ROUTE = '/api/users'
export const USER_ROUTE = '/api/users/:user_id' //PATCH DELETE GET
export const USER_AVATAR_ROUTE = '/api/users/avatar'//PATCH GET

export const CATEGORIES_ROUTE = '/api/categories'

export const MAIN_ROUTE = '/'
export const POST_CREATION_ROUTE = '/postcreation'
export const SETTINGS_ROUTE = '/settings'
export const ABOUT_ROUTE = '/about'
export const HELP_ROUTE = '/help'
export const ERROR_ROUTE = '/error'

