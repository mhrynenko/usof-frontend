<h1 align='center'> USOF BACKEND </h1>

### Description   
This is a backend part for service for sharing questions and solving problems, connected to programming.  

### How to start   
1. Clone project
2. In folder with project run `npm install`
3. After set your gmail data in .env (MAIL_USER and MAIL_PASSWORD) 
4. Create database (MYSQL) and user with help of `mysql -u root -p < db.sql` or you can do it manually, also
there is an opportunity to set nedeed data (db name, user and pass) in .env  (DB_NAME, DB_USER, DB_PASS)
4. Finally, start the server with `node server.js`     
    
### ENDPOINTS WITH SOME EXAMPLES   

**POST** - `/api/auth/register` - registration of a new user, required parameters are[login, password, password confirmation, email]   
![изображение](https://user-images.githubusercontent.com/108219165/192091466-37b57b0d-b754-4a3f-b4ff-1cd501581cdc.png)
   
**POST** - `/api/auth/login` - log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in   
**POST** - `/api/auth/logout` - log out authorized user   
**POST** - `/api/auth/password-reset` - send a reset link to user email, requiredparameter is [email]   
**POST** - `/api/auth/password-reset/<confirm_token>` - confirm new password with atoken from email, required parameter is a [new password]   
**GET** - `/api/auth/email-confirm/<confirm_token>` - confirm email   
    
    
     
**GET** - `/api/users` - get all users    
**GET** - `/api/users/<user_id>` - get specified user data    
**POST** - `/api/users` - create a new user, required parameters are [login, password,password confirmation, email, role]    
**PATCH** - `/api/users/avatar` - upload user avatar   
**PATCH** - `/api/users/<user_id>` - update user data   
**DELETE** - `/api/users/<user_id>` - delete user    
    
      
      
**GET** - `/api/posts` - get all posts 
![изображение](https://user-images.githubusercontent.com/108219165/192094177-880eb3b2-6d69-46f6-b25e-643e8960ad67.png)
    
**GET** - `/api/posts/<post_id>` - get specified post data    
**GET** - `/api/posts/<post_id>/comments` - get all comments for the specified post     
**GET** - `/api/posts/<post_id>/categories` - get all categories associated with the specified post       
**GET** - `/api/posts/<post_id>/like` - get all likes under the specified post    
**POST** - `/api/posts/<post_id>/comments` - create a new comment, required parameteris [content]    
**POST** - `/api/posts/` - create a new post, required parameters are [title, content,categories]   
**POST** - `/api/posts/<post_id>/like` - create a new like under a post    
**PATCH** - `/api/posts/<post_id>` - update the specified post    
**DELETE** - `/api/posts/<post_id>` - delete a post    
**DELETE** - `/api/posts/<post_id>/like` - delete a like under a post     
     
     
     
**GET** - `/api/categories` - get all categories    
**GET** - `/api/categories/<category_id>` - get specified category data    
**GET** - `/api/categories/<category_id>/posts` - get all posts associated with thespecified category    
**POST** - `/api/categories` - create a new category, required parameter is [title]    
**PATCH** - `/api/categories/<category_id>` - update specified category data    
**DELETE** - `/api/categories/<category_id>` - delete a category     
     
     
     
     
**GET** - `/api/comments/<comment_id>` - get specified comment data   
**GET** - `/api/comments/<comment_id>/like` - get all likes under the specified comment   
**POST** - `/api/comments/<comment_id>/like` - create a new like under a comment   
**PATCH** - `/api/comments/<comment_id>` - update specified comment data    
**DELETE** - `/api/comments/<comment_id>` - delete a comment    
**DELETE** - `/api/comments/<comment_id>/like` - delete a like under a comment    


