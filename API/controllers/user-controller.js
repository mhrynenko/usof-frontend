const { users } = require('../db.js');
const { Op } = require("sequelize");
const uuid = require('uuid');

const { generateAccessToken } = require('../helpers/jwt-helpers');
const { createUrlParams } = require('../helpers/url-helpers');

const getAll = async (req, res) => {
    try {
        let page = req.query.page ?? 0;
        let limit = req.query.limit ?? 5;
        page = Number(page);
        limit = Number(limit);
        
        const allUsers = await proccesPagination(process.env.API_URL, req.route.path + createUrlParams(req.query), 
            users, limit, page, {});
    
        return res.json ({
            allUsers
        });
    }
    catch (error) {
        console.log("Some error while getting users: ", error.message); 
        return res.json ({
            error : "Some error while getting users: " + error.message
        });   
    }
};


const getOne = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const userDB = await users.findOne({
            where: { 
                id : user_id
            } 
        });

        const user = {
            login : userDB.dataValues.login,
            full_name : userDB.dataValues.full_name,
            email : userDB.dataValues.email,
            status : userDB.dataValues.status,
            rating : userDB.dataValues.rating,
            profile_picture : userDB.dataValues.profile_picture,
        }

        res.json ({
            user
        });
    }
    catch (error) {
        console.log("Some error while getting user: ", error.message);  
        return res.json ({
            error : "Some error while getting user: " + error.message
        });   
    }
};

const getAvatar = async (req, res) => {
    try {
        
        const user = await users.findOne({
            where: { 
                login : req.query.login
            } 
        });

        res.json ({
            profile_picture : user.dataValues.profile_picture,
        });
    }
    catch (error) {
        console.log("Some error while getting user avatar: ", error.message);  
        return res.json ({
            error : "Some error while getting user avatar: " + error.message
        });   
    }
};

const create = async (req, res) => {
    try {
        if (req.body.password !== req.body.password_confirm) {
            return res.json ({
                error : "Wrong confirm password"
            });
        }
        const token =  uuid.v4();
    
        const [user, created ] = await users.findOrCreate({
            where: { 
                [Op.or]: [
                    { login : req.body.login },
                    { email : req.body.email },
                ]
            },
            defaults: {
                login : req.body.login,
                password : req.body.password,
                full_name : "",
                email : req.body.email,
                profile_picture : "",
                rating : 0,
                role : req.body.role,
                token : token
            }
        });
    
        let errMsg = '';
        if (req.body.login.toLowerCase() === user.dataValues.login.toLowerCase()) {
            errMsg += 'login';
        }
        if (req.body.email.toLowerCase() === user.dataValues.email.toLowerCase()) {
            if (errMsg.length !== 0) {
                errMsg += ' and ';
            }
            errMsg += 'email';
        }
    
        let result = {};
        if (created) {
            const link = process.env.API_URL + "/api/auth/email-confirm/" + token;
            result = await sendEmail(user.dataValues.email, "ПОДТВЕРЖДЕНИЕ ПАРОЛЯ", link)
        }
    
        return res.json({
            error : created ? null : `User with such ${errMsg} exists`,
            created : created,
            email : (Object.keys(result).length === 0) ? null : result
        });
    }
    catch (error) {
        console.log("Some error while creating user: ", error.message);    
        return res.json ({
            error : "Some error while creating users: " + error.message
        }); 
    }
};

const avatar = async (req, res) => {
    try {
        const user = await users.findOne({
            where: { 
                login: req.user.login,
            } 
        });
        
        if ((user === null) || (user.dataValues.login !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Update user avatar can only admin and exact user",
            })
        }

        let filename = ''
        if (req.file) {
            filename = req.file.filename
        }

        await users.update({ profile_picture: filename }, {
            where : {
                login: req.user.login,
            }
        });
        
        res.json ({
            message : "Avatar was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating user avatar: ", error.message); 
        return res.json ({
            error : "Some error while updating user avatar: " + error.message
        });    
    }
};

const status = async (req, res) => {
    try {
        await users.update({ status: req.body.status }, {
            where : {
                login: req.user.login,
            }
        });
        
        res.json ({
            message : "Status was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating user avatar: ", error.message); 
        return res.json ({
            error : "Some error while updating user avatar: " + error.message
        });    
    }
};

const userData = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const user = await users.findOne({
            where: { 
                id : user_id
            } 
        });
    
        if ((user === null) || (user.dataValues.login !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Update data can only admin and exact user",
            })
        }
    
        const { count } = await users.findAndCountAll({
            where: { 
                [Op.or]: [
                    { login : req.body.login },
                    { email : req.body.email },
                ]
            },
        });
        
        if (count > 0) {
            return res.json ({
                error : "Such login or / and email is already exists"
            })
        }
    
        let login = req.body.login ? req.body.login : user.dataValues.login;
        await users.update({ 
            login : login,
            full_name : req.body.full_name ? req.body.full_name : user.dataValues.full_name,
            email : req.body.email ? req.body.email : user.dataValues.email,
        }, {
            where : {
                id : user_id
            }
        });

        const updated = await users.findOne({
            where: { 
                id : user_id
            } 
        });

        const token = generateAccessToken(updated.dataValues.login, updated.dataValues.role, updated.dataValues.id);

        res.cookie('token', token);
        res.cookie('status', updated.dataValues.role);
    
        return res.json({
            error : null,
            message : "Data was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating user data: ", error.message);  
        return res.json ({
            error : "Some error while updating user data: " + error.message
        });   
    }
};

const deleteOne = async(req, res) => {
    try {
        const user_id = req.params.user_id;

        const user = await users.findOne({
            where: { 
                id : user_id
            } 
        });
    
        if ((user === null) || (user.dataValues.login !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Delete user can only admin and exact user",
            })
        }
    
        await users.destroy({
            where: {
                id : user_id
            }
        });
    
        return res.json({
            error : null,
            message : `User with id=${user_id} was deleted`
        });
    }
    catch (error) {
        console.log("Some error while deleting user: ", error.message);   
        return res.json ({
            error : "Some error while deleting user: " + error.message
        });  
    }
};

module.exports = {
    getAll,
    getOne,
    getAvatar,
    create,
    avatar,
    status,
    userData,
    deleteOne,
}