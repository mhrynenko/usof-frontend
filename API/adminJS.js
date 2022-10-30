const AdminJS = require('adminjs')
const AdminJSSequilize = require('@adminjs/sequelize');
const AdminJSExpress = require('@adminjs/express')

const { checkPassword } = require('./helpers/bcrypt-helpers');

const dbModel = require('./db.js');

AdminJS.registerAdapter(AdminJSSequilize);

const adminJs = new AdminJS({
    resources: [ 
        dbModel.users,
        dbModel.posts,
        dbModel.likes,
        dbModel.comments,
        dbModel.categories
    ],    
    rootPath: '/admin', // Path to the AdminJS dashboard.
});


const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
        authenticate: async (email, password) => {
            const user = await dbModel.users.findOne({
                where: { 
                    email : email,
                    role : 'admin'
                } 
            });
            if (user) {
                const isCorrectPass = await checkPassword(password, user.dataValues.password);
                if (isCorrectPass) {
                    return user;
                }
            }
            return false;
        },
    },
    null,   
    {
        resave: false, 
        saveUninitialized: true,
    }
);


module.exports = {
    adminJs,
    adminRouter,
}