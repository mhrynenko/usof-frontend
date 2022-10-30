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
    
    
### SOME EXAMPLES OF ITS VIEW

![изображение](https://user-images.githubusercontent.com/108219165/192091466-37b57b0d-b754-4a3f-b4ff-1cd501581cdc.png)
   
