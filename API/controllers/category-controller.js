const dbModels = require('../db.js');

const getAll = async (req, res) => {
    try {      
        const allCategories = await dbModels.categories.findAndCountAll()

        return res.json ({
            allCategories
        });
    }
    catch (error) {
        console.log("Some error while getting categories: ", error.message);
        return res.json ({
            error : "Some error while deleting categories: " + error.message
        }); 
    }
};

const getOne = async (req, res) => {
    try {
        const category_id = req.params.category_id;

        const category = await dbModels.categories.findOne({
            where: { 
                id : category_id
            } 
        });
        
        return res.json ({
            category
        });
    } 
    catch (error) {
        console.log("Some error while getting category: ", error.message);   
        return res.json ({
            error : "Some error while getting category: " + error.message
        });  
    }
    
};

const create = async (req, res) => {
    try {
        const [ created ] = await dbModels.categories.findOrCreate({ 
            where : {
                title : req.body.title,
            },
            defaults : {
                title : req.body.title,
                description : req.body.description ? req.body.description : 'category description',
            }
        });

        if (!created) {
            return res.json({
                error : "Such category is already exists"
            });
        }
    
        return res.json({
            error : null,
            message : "Category was created successfully"
        });
    } 
    catch (error) {
        console.log("Some error while creating category: ", error.message);    
        return res.json ({
            error : "Some error while creating category: " + error.message
        }); 
    }
};

const update = async (req, res) => {
    try {
        const category_id = req.params.category_id;

        const category = await dbModels.categories.findOne({
            where: { 
                id : category_id
            } 
        });
    
        if (category === null) {
            return res.json ({
                error : "No such category"
            });
        }
    
        await dbModels.categories.update({ 
            title : req.body.title ? req.body.title : category.dataValues.title,
            description : req.body.description ? req.body.description : category.dataValues.description,
        }, {
            where : {
                id : category.dataValues.id
            }
        });
    
        return res.json ({
            error : null,
            message : "Category data was updated"
        });
    }
    catch (error) {
        console.log("Some error while updating category: ", error.message);   
        return res.json ({
            error : "Some error while updating category: " + error.message
        });  
    }
};

const deleteOne = async (req, res) => {
    try {
        const category_id = req.params.category_id;
 
        const category = await dbModels.categories.findOne({
            where: { 
                id : category_id
            } 
        });
    
        await dbModels.categories.destroy({
            where: {
                id : category.dataValues.id
            }
        });
    
        return res.json({
            error : null,
            message : `Comment with id=${category_id} was deleted`
        });
    }
    catch (error) {
        console.log("Some error while deleting category: ", error.message); 
        return res.json ({
            error : "Some error while deleting category: " + error.message
        });    
    }
};

const getPosts = async (req, res) => {
    try {
        const category_id = req.params.category_id;

        const posts_categories = await dbModels.posts_categories.findAll({
            where: { 
                category_id : category_id
            } 
        });
    
        let posts = [];
        for (const post_category of posts_categories ) {
    
            const post = await dbModels.posts.findOne({
                where: { 
                    id : post_category.dataValues.post_id
                } 
            });
            posts.push(post);
        }
        return res.json ({
            posts
        })
    }
    catch (error) {
        console.log("Some error while getting posts by category: ", error.message);    
        return res.json ({
            error : "Some error while getting posts by category: " + error.message
        }); 
    }
};

module.exports = {
    getAll,
    create,
    getOne,
    update,
    deleteOne,
    getPosts
}