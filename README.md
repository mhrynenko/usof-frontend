<h1 align='center'> USOF</h1>

### Description   
This is a full project for sharing and solving problems.  

### How to start   
1. Clone project
2. In folder with project run `npm install` to install common modules
3. Go to `cd API` and run `npm install` to install backend modules
4. After this set your gmail data in .env (MAIL_USER and MAIL_PASSWORD), but if you don't want to do it, 
you can just use created accounts, whithout setting your gmail data server just won't send mail for confirming 
5. Create database (MYSQL) with help of `mysql -u root -p < db.sql` or you can manually create `usof` database 
and server will create tables by itself, also there is an opportunity to set nedeed data (db name, user and pass)
in .env  (DB_NAME, DB_USER, DB_PASS)
6. Finally, start the server with `node server.js` (
    !!! Important, if you just create database without tables, you probably will be needed to run server twice,
    the first attempt will create tables and the second one will set some data
)
7. Return to the prev folder `cd ..` and go to `cd web` run `npm install` to install frontend modules
8. Start the app with `npm start`
9. The app will open page in default browser, but you can go to `localhost:3000` in other browsers
    
    
    
### General info
1. Main page, help and search doesn't work, because I don't have enough time to do it
2. Replying on comments wasn't implemented because of the same reason
3. You can just look posts, filter them, go to post page, like post/comment, edit/delete your post/comments 
or if you have admin role, you could delete posts and comments and also you can change some user info on settings: 
photo, login, fullname, other fields require more complicated logic, so it will be in future versions (if they will be ;) )
      
         
         
         

### SOME EXAMPLES OF ITS VIEW

![изображение](https://user-images.githubusercontent.com/108219165/198872169-004cb13f-5e3e-4fac-8bf2-2e798a167f43.png)   

![изображение](https://user-images.githubusercontent.com/108219165/198872217-ab1c4d36-af54-432f-ade5-6685b8e9275a.png)

![изображение](https://user-images.githubusercontent.com/108219165/198872232-6f12eafd-c261-432e-ae47-624469014b30.png)

![изображение](https://user-images.githubusercontent.com/108219165/198872255-5223b08c-b6cd-48a4-9721-cf75034f6867.png)

![изображение](https://user-images.githubusercontent.com/108219165/198872420-0ed3d1fb-2bf3-4960-8e7b-07fd4cf3ecea.png)


   
