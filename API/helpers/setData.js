const uuid = require('uuid');
const db = require('../db')

const { setPostsCategories } = require('../helpers/db-helpers');

async function setSomeData() {
    try {
        let token =  uuid.v4();
        await db.users.findOrCreate({
            where: { 
                login : 'admin',
            },
            defaults: {
                login : 'admin',
                password : 'admin',
                full_name : "Admin admin",
                email : 'admin@admin.ua',
                profile_picture : "",
                token : token,
                role : "admin",
                confirmedEmail : true
            }
        });
    
        token =  uuid.v4();
        await db.users.findOrCreate({
            where: { 
                login : 'login',
            },
            defaults: {
                login : 'login',
                password : 'password',
                full_name : "Login login",
                email : 'login@gmail.com',
                profile_picture : "",
                token : token,
                role : "user",
                confirmedEmail : true
            }
        });
    
        token =  uuid.v4();
        await db.users.findOrCreate({
            where: { 
                login : 'maksym',
            },
            defaults: {
                login : 'maksym',
                password : 'password',
                full_name : "MAKSYM",
                email : 'maksym@mail',
                profile_picture : "",
                token : token,
                role : "user",
                confirmedEmail : true
            }
        });
    
        token =  uuid.v4();
        await db.users.findOrCreate({
            where: { 
                login : 'someone',
            },
            defaults: {
                login : 'someone',
                password : 'password',
                full_name : "someone",
                email : 'someone@mail',
                profile_picture : "",
                token : token,
                role : "user",
                confirmedEmail : true
            }
        });
    
        token =  uuid.v4();
        await db.users.findOrCreate({
            where: { 
                login : 'fifth',
            },
            defaults: {
                login : 'fifth',
                password : 'password',
                full_name : "someone",
                email : 'fifth@mail',
                profile_picture : "",
                token : token,
                role : "user",
                confirmedEmail : true
            }
        });
    
        await db.categories.findOrCreate({
            where: { 
                title : 'js',
            },
            defaults: {
                title : 'js',
            }
        })
    
        await db.categories.findOrCreate({
            where: { 
                title : 'nodejs',
            },
            defaults: {
                title : 'nodejs',
            }
        })
    
        await db.categories.findOrCreate({
            where: { 
                title : 'javascript',
            },
            defaults: {
                title : 'javascript',
            }
        })
    
        await db.categories.findOrCreate({
            where: { 
                title : 'C++',
            },
            defaults: {
                title : 'C++',
            }
        })
    
        await db.categories.findOrCreate({
            where: { 
                title : 'sql',
            },
            defaults: {
                title : 'sql',
            }
        })
    
        const id1 = await db.posts.findOrCreate ({
            where : {
                title : '1 post'
            },
            defaults : {
                author : 'login',
                title : '1 post',
                publish_date : new Date(),
                content : '1 post content',
                categories : 'js nodejs javascript',
                status : 'inactive' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'js nodejs javascript'.split(' '), id1[0].dataValues.id);
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id1[0].dataValues.id, 
                author : 'maksym',
            },
            defaults : {
                post_id : id1[0].dataValues.id, 
                author : 'maksym',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id1[0].dataValues.id, 
                author : 'someone',
            },
            defaults : {
                post_id : id1[0].dataValues.id, 
                author : 'someone',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
    
        const id2 = await db.posts.findOrCreate ({
            where : {
                title : '2 post'
            },
            defaults : {
                author : 'admin',
                title : '2 post',
                publish_date : new Date(),
                content : '2 post content',
                categories : 'js javascript' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'js javascript'.split(' '), id2[0].dataValues.id);
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id2[0].dataValues.id, 
                author : 'someone',
            },
            defaults : {
                post_id : id2[0].dataValues.id, 
                author : 'someone',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
    
        const id3 = await db.posts.findOrCreate ({
            where : {
                title : '3 post'
            },
            defaults : {
                author : 'login',
                title : '3 post',
                publish_date : new Date(),
                content : '3 post content',
                categories : 'js nodejs javascript' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'javascript'.split(' '), id3[0].dataValues.id);
    
        const id4 = await db.posts.findOrCreate ({
            where : {
                title : '4 post'
            },
            defaults : {
                author : 'login',
                title : '4 post',
                publish_date : new Date(),
                content : '4 post content',
                categories : 'nodejs' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'nodejs'.split(' '), id4[0].dataValues.id);
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id4[0].dataValues.id, 
                author : 'someone',
            },
            defaults : {
                post_id : id4[0].dataValues.id, 
                author : 'someone',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id4[0].dataValues.id, 
                author : 'fifth',
            },
            defaults : {
                post_id : id4[0].dataValues.id, 
                author : 'fifth',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
    
        const id5 = await db.posts.findOrCreate ({
            where : {
                title : '5 post'
            },
            defaults : {
                author : 'admin',
                title : '5 post',
                publish_date : new Date(),
                content : '5 post content',
                categories : 'nodejs',
                status : 'inactive'
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'nodejs'.split(' '), id5[0].dataValues.id);
    
        const id6 = await db.posts.findOrCreate ({
            where : {
                title : '6 post'
            },
            defaults : {
                author : 'login',
                title : '6 post',
                publish_date : new Date(),
                content : '6 post content',
                categories : 'javascript' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'javascript'.split(' '), id6[0].dataValues.id);
    
        const id7 = await db.posts.findOrCreate ({
            where : {
                title : '7 post'
            },
            defaults : {
                author : 'admin',
                title : '7 post',
                publish_date : new Date(),
                content : '7 post content',
                categories : 'js nodejs javascript' 
            }
        });
    
        await setPostsCategories(db.categories, db.posts_categories, 'js nodejs javascript'.split(' '), id7[0].dataValues.id);
    
        await db.comments.findOrCreate ({
            where : {
                post_id : id7[0].dataValues.id, 
                author : 'admin',
            },
            defaults : {
                post_id : id7[0].dataValues.id, 
                author : 'admin',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
        
        await db.comments.findOrCreate ({
            where : {
                post_id : id7[0].dataValues.id, 
                author : 'login',
            },
            defaults : {
                post_id : id7[0].dataValues.id, 
                author : 'login',
                publish_date : new Date(),
                content : "There is some text"
            }
        });
        
        await db.likes.findOrCreate({
            where : {
                author : 'login',
                post_id : 5,
                comment_id : null
            },
            defaults : {
                author : "login",
                publish_date : new Date(),
                post_id : 5,
                comment_id : null,
                type : 1
            }
        });
    
        await db.likes.findOrCreate({
            where : {
                author : 'admin',
                post_id : 5,
                comment_id : null
            },
            defaults : {
                author : "admin",
                publish_date : new Date(),
                post_id : 5,
                comment_id : null,
                type : 1
            }
        });
    
        await db.likes.findOrCreate({
            where : {
                author : 'admin',
                post_id : 7,
                comment_id : null
            },
            defaults : {
                author : "admin",
                publish_date : new Date(),
                post_id : 7,
                comment_id : null,
                type : -1
            }
        });
    
        await db.likes.findOrCreate({
            where : {
                author : 'login',
                post_id : 2,
                comment_id : null
            },
            defaults : {
                author : "login",
                publish_date : new Date(),
                post_id : 2,
                comment_id : null,
                type : 1
            }
        });
    
        await db.likes.findOrCreate({
            where : {
                author : 'login',
                post_id : 7,
                comment_id : null
            },
            defaults : {
                author : "login",
                publish_date : new Date(),
                post_id : 7,
                comment_id : null,
                type : -1
            }
        });
    
        await db.likes.findOrCreate({
            where : {
                author : 'login',
                post_id : 3,
                comment_id : null
            },
            defaults : {
                author : "login",
                publish_date : new Date(),
                post_id : 3,
                comment_id : null,
                type : 1
            }
        });

        await db.likes.findOrCreate({
            where : {
                author : 'login',
                post_id : null,
                comment_id : 7
            },
            defaults : {
                author : "login",
                publish_date : new Date(),
                post_id : null,
                comment_id : 7,
                type : 1
            }
        });

        await db.likes.findOrCreate({
            where : {
                author : 'admin',
                post_id : null,
                comment_id : 7
            },
            defaults : {
                author : "admin",
                publish_date : new Date(),
                post_id : null,
                comment_id : 7,
                type : 1
            }
        });

        await db.likes.findOrCreate({
            where : {
                author : 'someone',
                post_id : null,
                comment_id : 7
            },
            defaults : {
                author : "someone",
                publish_date : new Date(),
                post_id : null,
                comment_id : 7,
                type : 1
            }
        });

        await db.likes.findOrCreate({
            where : {
                author : 'someone',
                post_id : null,
                comment_id : 6
            },
            defaults : {
                author : "someone",
                publish_date : new Date(),
                post_id : null,
                comment_id : 6,
                type : -1
            }
        });
    }
    catch (error) {
        console.log('Some error while setting data: ', error.message);
    }
}

module.exports = {
    setSomeData,
}