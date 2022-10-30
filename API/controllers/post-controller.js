const Sequelize  = require('sequelize');
const dbModels = require('../db.js');
const _ = require('lodash');
const { byLikes, byDate, 
        filterCategory, filterStatus,
        filterDateBetween, filterActive,
      } = require('../helpers/filters-orders');

const { proccesPagination, setPostsCategories } = require('../helpers/db-helpers');
const { sequelize } = require('../db.js');

const getAll = async (req, res) => {
    try {
        let page = req.query.page ?? 0;
        let limit = req.query.limit ?? 5;
        page = Number(page);
        limit = Number(limit);

        const likesParams = {
            attributes : [
                'id', 'author', 'title',
                'publish_date', 'status',
                'content', 'categories',
                [Sequelize.literal(`(
                    SELECT IFNULL(SUM(likes.type), 0) 
                    FROM likes 
                    WHERE posts.id = likes.post_id 
                )`), 'likes']
            ],
        }
        // let parametrs = Object.assign({},
        //     req.query.filterCategory && filterCategory(dbModels.categories, req.query.filterCategory),
        //     req.query.byLikes && byLikes(req.query.byLikes),
        //     req.query.byDate && byDate(req.query.byDate),
        //     req.query.filterDateBetween && filterDateBetween(req.query.filterDateBetween.from, req.query.filterDateBetween.to),
        //     req.query.status && filterStatus(req.query.status),
        // );

        let parametrs = _.merge({},
            req.query.filterCategory && filterCategory(dbModels.categories, req.query.filterCategory),
            req.query.byLikes && byLikes(req.query.byLikes),
            req.query.byDate && byDate(req.query.byDate),
            req.query.filterDateBetween && filterDateBetween(req.query.filterDateBetween.from, req.query.filterDateBetween.to),
            req.query.status && filterStatus(req.query.status),
            likesParams,
        );


        _.merge(parametrs, likesParams)

        if (req.query.filterDateBetween) {
            const {where} = filterDateBetween(req.query.filterDateBetween.from, req.query.filterDateBetween.to);
            parametrs.where.publish_date = where.publish_date 
        }

        if (req.query.byDate && req.query.byLikes) {
            parametrs = _.merge(parametrs, {order : [['publish_date', req.query.byDate], [Sequelize.literal('likes'), req.query.byLikes]]})
        }
        
        const allPosts = await proccesPagination(dbModels.posts, limit, page, parametrs);

        for (let i = 0; i < allPosts.count; i++) {
            if (allPosts.rows[i] === undefined){
                continue;
            }
            const commentAmount = await dbModels.comments.count({
                where: { 
                    post_id : allPosts.rows[i].dataValues.id
                }
            })
            allPosts.rows[i].dataValues.commentAmount = commentAmount;
        }
        
        return res.json ({
            allPosts
        });
    }
    catch (error) {
        console.log("Some error while getting posts: ", error.message);    
        return res.json ({
            error : "Some error while getting posts: " + error.message
        }); 
    }
};

const getOne = async (req, res) => {
    try {
        const post_id = req.params.post_id;

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
        
        return res.json ({
            post
        });
    }
    catch (error) {
        console.log("Some error while getting post: ", error.message);   
        return res.json ({
            error : "Some error while getting post: " + error.message
        });  
    }
};

const getOneComments = async (req, res) => {
    try {
        const post_id = req.params.post_id;

        const comments = await dbModels.comments.findAndCountAll({
            where: { 
                post_id : post_id
            }
        })

        return res.json ({
            comments
        });
    }
    catch (error) {
        console.log("Some error while getting comments for post: ", error.message);  
        return res.json ({
            error : "Some error while getting comments for post: " + error.message
        });   
    }
};

const getOneLikes = async (req, res) => {
    try {
        const post_id = req.params.post_id;

        const likes = await dbModels.likes.findAndCountAll({
            where: { 
                post_id : post_id,
                comment_id : null
            },
        })

        const likesAmount = await sequelize.query(
            `SELECT IFNULL(SUM(likes.type), 0) 
            AS 'amount'
            FROM likes 
            WHERE likes.post_id = ${post_id}`,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        Object.assign(likes, ...likesAmount)

        return res.json ({
            likes
        });
    }
    catch (error) {
        console.log("Some error while getting likes for post: ", error.message);  
        return res.json ({
            error : "Some error while getting likes for post: " + error.message
        }); 
    }
};

const getOneCategories = async (req, res) => {
    try {
        const post_id = req.params.post_id;

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });

        if (post === null) {
            return res.json ({
                categories : null
            });
        }

        let postCategories = post.dataValues.categories.split(' ');

        let categories = [];

        for (const category of postCategories) {
            const categoryDB = await dbModels.categories.findOne({
                where: { 
                    title : category
                } 
            });
            categories.push(categoryDB);
        }
        
        res.json ({
            categories
        });
    }
    catch (error) {
        console.log("Some error while getting categories for post: ", error.message); 
        return res.json ({
            error : "Some error while getting categories for post: " + error.message
        });    
    }
};



const create = async (req, res) => {
    try {
        const isWrongCategory = await checkCategories(req.body.categories.split(' '));
        if (!isWrongCategory) {
            return res.json ({
                error : "Some category is wrong"
            });
        } 

        let filesNames = [];
        req.files.forEach(file => {
            filesNames.push(file.filename)
        })

        const post = await dbModels.posts.create({ 
            author : req.user.login,
            title : req.body.title,
            publish_date : new Date(),
            content : req.body.content,
            categories : req.body.categories ,
            files : filesNames.join(' ')
        });
    
        await setPostsCategories(dbModels.categories, dbModels.posts_categories, req.body.categories.split(' '), post.dataValues.id);  

        return res.json({
            error : null,
            message : "Post was created successfully",
            id : post.dataValues.id,
        });
    }
    catch (error) {
        console.log("Some error while creating post: ", error.message);  
        return res.json ({
            error : "Some error while creating post: " + error.message
        });   
    }
};

const createComment = async (req, res) => {
    try {
        const post_id = req.params.post_id;   

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if (post === null) {
            return res.json ({
                error : "No such post"
            });
        }

        let filesNames = [];
        req.files.forEach(file => {
            filesNames.push(file.filename)
        })
    
        await dbModels.comments.create({
            post_id : post_id, 
            author : req.user.login,
            publish_date : new Date(),
            content : req.body.content,
            files : filesNames.join(' ')
        });
    
        return res.json({
            error : null,
            message : "Comment was created successfully"
        });
    }
    catch (error) {
        console.log("Some error while creating comment: ", error.message);  
        return res.json ({
            error : "Some error while creating comment: " + error.message
        });   
    }
};

const createLike = async(req, res) => {
    try {
        const post_id = req.params.post_id; 

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if (post === null) {
            return res.json({
                error : `No such post`,
            });
        }
    
        const [ like, created ] = await dbModels.likes.findOrCreate({
            where : {
                author : req.user.login,
                post_id : post_id,
                comment_id : null
            },
            defaults : {
                author : req.user.login,
                publish_date : new Date(),
                post_id : post_id,
                comment_id : null,
                type : (req.body.type === 'like') ? +1 : -1
            }
        });

        const postAuthor = await dbModels.users.findOne({
            where: { 
                login : post.dataValues.author
            } 
        });
    
        if (!created) {
            if (((req.body.type === 'like') ? +1 : -1) === like.dataValues.type){
                return res.json({
                    error : `Your ${req.body.type} already exists`,
                });
            }

            await dbModels.users.update({ 
                rating : (req.body.type === 'like') ? postAuthor.dataValues.rating + 1 :  postAuthor.dataValues.rating - 1,
            }, {
                where : {
                    login : post.dataValues.author
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
            rating : (req.body.type === 'like') ? postAuthor.dataValues.rating + 1 :  postAuthor.dataValues.rating - 1,
        }, {
            where : {
                login : post.dataValues.author
            }
        });
    
        return res.json ({
            error : null,
            message : `Your ${req.body.type} was created`
        });
    }
    catch (error) {
        console.log("Some error while creating like: ", error.message);  
        return res.json ({
            error : "Some error while creatin like: " + error.message
        });   
    }
};

const deleteLike = async (req, res) => {
    try {
        const post_id = req.params.post_id; 

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if (post === null) {
            return res.json({
                error : `No such post`,
            });
        }
        
        const like = await dbModels.likes.findOne({
            where : {
                post_id : post_id,
                comment_id : null,
                author : req.user.login
            }
        });
    
        if (like === null) {
            return res.json({
                error : "No likes for this post"
            });
        }
        
        await dbModels.likes.destroy({
            where: {
                id : like.dataValues.id
            }
        });
    
        const postAuthor = await dbModels.users.findOne({
            where: { 
                login : post.dataValues.author
            } 
        });
    
        await dbModels.users.update({ 
            rating : (like.dataValues.type === 'like') ? postAuthor.dataValues.rating - 1 :  postAuthor.dataValues.rating + 1,
        }, {
            where : {
                login : post.dataValues.author
            }
        });
    
        return res.json({
            error : null,
            message : `Your like / dislike was deleted for post with id=${post_id}`
        });    
    }
    catch (error) {
        console.log("Some error while deleting like: ", error.message);    
        return res.json ({
            error : "Some error while deleting like: " + error.message
        }); 
    }
};

const update = async (req, res) => {
    try {
        const post_id = req.params.post_id; 

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if (post === null) {
            return res.json ({
                error : "No such post"
            });
        }
        
        if (post.dataValues.author !== req.user.login) {
            return res.json ({
                error : "Change post can only creator"
            });
        }
    
        if (req.body.categories) {
            for (const category of post.dataValues.categories.split(' ')) {
                const categoryDB = await dbModels.categories.findOne({
                    where: { 
                        title : category
                    } 
                });
    
                await dbModels.posts_categories.destroy({
                    where: {
                        post_id : post.dataValues.id,
                        category_id : categoryDB.dataValues.id
                    }
                });
            }
    
            await setPostsCategories(dbModels.categories, dbModels.posts_categories, req.body.categories.split(' '), post.dataValues.id);
        }

        let filesNames = [];
        req.files.forEach(file => {
            filesNames.push(file.filename)
        })
    
        await dbModels.posts.update({ 
            title : req.body.title ? req.body.title : post.dataValues.title,
            content : req.body.content ? req.body.content : post.dataValues.content,
            categories : req.body.categories ? req.body.categories : post.dataValues.categories,
            files : filesNames.length > 0 ? filesNames.join(' ') : post.dataValues.files,
        }, {
            where : {
                id : post.dataValues.id
            }
        });
    
        return res.json ({
            error : null,
            message : "Post data was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating post: ", error.message);  
        return res.json ({
            error : "Some error while updating post: " + error.message
        });   
    }
};

const updateStatus = async (req, res) => {
    try {
        const post_id = req.params.post_id; 

        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if (post === null) {
            return res.json ({
                error : "No such post"
            });
        }

        const status = (post.dataValues.status === 'active') ? 'inactive' : 'active'

        await dbModels.posts.update({ 
            status : status
        }, {
            where : {
                id : post.dataValues.id
            }
        });
    
        return res.json ({
            error : null,
            message : "Post status was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating status: ", error.message);  
        return res.json ({
            error : "Some error while updating status: " + error.message
        });   
    }
};

const deleteOne = async (req, res) => {
    try {
        const post_id = req.params.post_id;
 
        const post = await dbModels.posts.findOne({
            where: { 
                id : post_id
            } 
        });
    
        if ((post === null) || (post.dataValues.author !== req.user.login) && (req.user.status !== 'admin')) {
            return res.json({
                error : "Delete post can only admin and exact user",
            })
        }
    
        await dbModels.posts.destroy({
            where: {
                id : post.dataValues.id
            }
        });

        await dbModels.likes.destroy({
            where: {
                post_id : post.dataValues.id,
                comment_id : null
            }
        });

        await dbModels.comments.destroy({
            where: {
                post_id : post.dataValues.id
            }
        });
    
        return res.json({
            error : null,
            message : `Post with id=${post_id} was deleted`
        });
    }
    catch (error) {
        console.log("Some error while deleting post: ", error.message);   
        return res.json ({
            error : "Some error while deleting post: " + error.message
        });  
    }
};

async function checkCategories (categories) {
    for (const category of categories) {
        const categoryCounter = await dbModels.categories.count({
            where: { 
                title : category
            } 
        });

        if (!categoryCounter) {
            return false;
        }
    }
    return true;
}

module.exports = {
    getAll,
    getOne,
    getOneComments,
    getOneLikes,
    getOneCategories,
    create,
    createComment,
    createLike,
    deleteLike,
    update,
    updateStatus,
    deleteOne,
}