const { Sequelize } = require('sequelize');
const { sequelize } = require('../db.js');
const dbModels = require('../db.js');

const getOne = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
        
        return res.json ({
            comment
        });
    }
    catch (error) {
        console.log("Some error while deleting comment: ", error.message);   
        return res.json ({
            error : "Some error while deleting comment: " + error.message
        });  
    }
};

const getOneLikes = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;

        const likes = await dbModels.likes.findAll({
            where: { 
                comment_id : comment_id,
                post_id : null
            } 
        });

        const likesAmount = await sequelize.query(
            `SELECT IFNULL(SUM(likes.type), 0) 
            AS 'amount'
            FROM likes 
            WHERE likes.comment_id = ${comment_id}`,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        let tmp = likesAmount[0];

        return res.json ({
            likes,
            amount : tmp.amount,
        });
    }
    catch (error) {
        console.log("Some error while getting likes for comment: ", error.message);   
        return res.json ({
            error : "Some error while getting likes for comment: " + error.message
        });  
    }
};

const createLike = async(req, res) => {
    try {
        const comment_id = req.params.comment_id; 

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json({
                error : "No such comment"
            });
        }

        const [ like, created ] = await dbModels.likes.findOrCreate({
            where : {
                author : req.user.login,
                post_id : null,
                comment_id : comment_id
            },
            defaults : {
                author : req.user.login,
                publish_date : new Date(),
                comment_id : comment_id,
                post_id : null,
                type : (req.body.type === 'like') ? +1 : -1
            }
        });
    
        const commentAuthor = await dbModels.users.findOne({
            where: { 
                login : comment.dataValues.author
            } 
        });
    
        if (!created) {
            if (((req.body.type === 'like') ? +1 : -1) === like.dataValues.type){
                return res.json({
                    error : `Your ${req.body.type} already exists`,
                });
            }
    
            await dbModels.users.update({ 
                rating : (req.body.type === 'like') ? commentAuthor.dataValues.rating + 1 :  commentAuthor.dataValues.rating - 1,
            }, {
                where : {
                    login : comment.dataValues.author
                }
            });
    
            await dbModels.likes.update({ 
                type : (req.body.type === 'like') ? +1 : -1,
            }, {
                where : {
                    id : like.dataValues.id
                }
            });
    
            return res.json ({
                error : null,
                message : `Your ${(like.dataValues.type === +1) ? 'like' : 'dislike'} was changed to ${req.body.type}`
            });
        }
    
        await dbModels.users.update({ 
            rating : (req.body.type === 'like') ? commentAuthor.dataValues.rating + 1 :  commentAuthor.dataValues.rating - 1,
        }, {
            where : {
                login : comment.dataValues.author
            }
        });
    
        return res.json ({
            error : null,
            message : `Your ${req.body.type} was created`
        });
    }
    catch (error) {
        console.log("Some error while creating likes for comment: ", error.message);    
        return res.json ({
            error : "Some error while creating likes for comment: " + error.message
        }); 
    }
};

const deleteLike = async (req, res) => {
    try {
        const comment_id = req.params.comment_id; 

        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json({
                error : `No such comment`,
            });
        }
        
        const like = await dbModels.likes.findOne({
            where : {
                post_id : null,
                comment_id : comment_id,
                author : req.user.login
            }
        });
    
        if (like === null) {
            return res.json({
                error : "No likes for this comment"
            });
        }
        
        await dbModels.likes.destroy({
            where: {
                id : like.dataValues.id
            }
        });
    
        const commentAuthor = await dbModels.users.findOne({
            where: { 
                login : comment.dataValues.author
            } 
        });
    
        await dbModels.users.update({ 
            rating : (like.dataValues.type === 'like') ? commentAuthor.dataValues.rating - 1 :  commentAuthor.dataValues.rating + 1,
        }, {
            where : {
                login : comment.dataValues.author
            }
        });
    
        return res.json({
            error : null,
            message : `Your like / dislike was deleted for comment with id=${comment_id}`
        });
    }
    catch (error) {
        console.log("Some error while deleting likes for comment: ", error.message);    
        return res.json ({
            error : "Some error while deleting likes for comment: " + error.message
        }); 
    }
};

const update = async (req, res) => {
    try {
        const comment_id = req.params.comment_id; 
 
        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
    
        if (comment === null) {
            return res.json ({
                error : "No such comment"
            });
        }

        if (comment.dataValues.author !== req.user.login) {
            return res.json ({
                error : "Change comment can only creator"
            });
        }

        let filesNames = [];
        req.files.forEach(file => {
            filesNames.push(file.filename)
        })
    
        await dbModels.comments.update({ 
            content : req.body.content ? req.body.content : comment.dataValues.content,
            files : filesNames.length > 0 ? filesNames.join(' ') : comment.dataValues.files, 
        }, {
            where : {
                id : comment.dataValues.id
            }
        });
    
        return res.json ({
            error : null,
            message : "Comment data was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating comment: ", error.message);   
        return res.json ({
            error : "Some error while updating comment: " + error.message
        });  
    }
};

const deleteOne = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;
 
        const comment = await dbModels.comments.findOne({
            where: { 
                id : comment_id
            } 
        });
        
        if ((comment === null) || (comment.dataValues.author !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Delete comment can only admin and exact user",
            })
        }
    
        await dbModels.comments.destroy({
            where: {
                id : comment.dataValues.id
            }
        });

        await dbModels.likes.destroy({
            where: {
                post_id : null,
                comment_id : comment.dataValues.id
            }
        });
    
        return res.json({
            error : null,
            message : `Comment with id=${comment_id} was deleted`
        });
    }
    catch (error) {
        console.log("Some error while deleting comment: ", error.message);   
        return res.json ({
            error : "Some error while deleting comment: " + error.message
        });  
    }
};


module.exports = {
    getOne,
    deleteOne,
    getOneLikes,
    createLike,
    deleteLike,
    update,
}