const uuid = require('uuid');

const { users } = require('../db.js');
const { Op } = require("sequelize");

const sendEmail = require('../helpers/sendMail');
const { generateAccessToken } = require('../helpers/jwt-helpers');
const { checkPassword } = require('../helpers/bcrypt-helpers');

const register = async (req, res) => {
    try {
        if (req.body.password !== req.body.password_confirm) {
            return res.json ({
                error : "Passwords are not the same"
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
    catch (err){
        console.log("Some error while register: ", err.message);
        return res.json ({
            err : "Some error while register: " + err.message
        }); 
    }
};

const login = async (req, res) => {
    try {
        const user = await users.findOne({
            where: { 
                login : req.body.login,
                email : req.body.email 
            } 
        });
    
        if (user === null) {
            return res.json({
                error : "No such user"
            })
        }
    
        if (user.dataValues.confirmedEmail === false) {
            return res.json ({
                error : "Email is not confirmed"
            });
        }
    
        const isCorrectPass = await checkPassword(req.body.password, user.dataValues.password);
    
        if (!isCorrectPass) {
            return res.json({
                error : "Wrong password"
            })
        }
    
        const token = generateAccessToken(user.dataValues.login, user.dataValues.role, user.dataValues.id);
        
        res.cookie('token', token);
        res.cookie('status', user.dataValues.role);
        return res.json ({
            error : null,
            canLogin : true,
            token : token,
            status : user.dataValues.status
        })
    }
    catch (err){
        console.log("Some error while login: ", err.message);
    }  
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('status');
    res.json({
        message: "logout will be with redirect to / with deleting token from browser"
    })
    // res.redirect('/');
};

const password_reset = async (req, res) => {
    try {
        const user = await users.findOne({
            where: { 
                email : req.body.email 
            } 
        });
    
        if (user === null) {
            return res.json({
                error : "No user with such email",
            })
        }
    
        const token = uuid.v4();
    
        await users.update({ token: token }, {
            where : {
                id: user.dataValues.id,
            }
        });
    
        const link = process.env.API_URL + "/api/auth/password-reset/" + token;
        sendEmail(user.dataValues.email, "СБРОС ПАРОЛЯ", link)
        .then (result => {
            res.json(result);
        })
    }
    catch (err){
        console.log("Some error while reseting password: ", err.message);
        return res.json ({
            err : "Some error while reseting password: " + err.message
        }); 
    }
};

const password_reset_confirm = async(req, res) => {
    try {
        const token = req.params.confirm_token;

        const user = await users.findOne({
            where: { 
                token : token
            } 
        });
    
        if (user === null) {
            return res.json({
                error : "No such user",
            })
        }
    
        await users.update({ password: req.body.new_password }, {
            where : {
                id: user.dataValues.id,
            }
        });
    
        res.json ({
            error : null,
            message : "password was updated"
        });
    }
    catch (err){
        console.log("Some error while confirming reseted password: ", err.message);
        return res.json ({
            err : "Some error while confirming reseted password: " + err.message
        }); 
    }
};

const email_confirm = async (req, res) => {
    try {
        const token = req.params.confirm_token;

        const user = await users.findOne({
            where: { 
                token : token
            } 
        });

        if (user === null) {
            return res.json({
                error : "No such user",
            })
        }

        await users.update({ confirmedEmail: true }, {
            where : {
                id: user.dataValues.id,
            }
        });

        res.json ({
            error : null,
            message : "email was confirmed"
        });
    }
    catch (err){
        console.log("Some error while confirming email: ", err.message);
        return res.json ({
            err : "Some error while confirming email: " + err.message
        }); 
    }
};

module.exports = {
    login,
    register,
    logout,
    password_reset,
    password_reset_confirm, 
    email_confirm
};