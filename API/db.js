const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.HOST,
    dialect : 'mysql',
    logging: false,
});

let categories = require("./models/categories")(sequelize);
let comments = require("./models/comments")(sequelize);
let likes = require("./models/likes")(sequelize);
let posts = require("./models/posts")(sequelize);
let users = require("./models/users")(sequelize);
let posts_categories = require("./models/posts_categories")(sequelize);

likes.belongsTo(comments, { foreignKey: "comment_id" });
comments.hasMany(likes, { foreignKey: "comment_id" });

likes.belongsTo(posts, { foreignKey: "post_id" });
posts.hasMany(likes, { foreignKey: "post_id" });

comments.belongsTo(users, { foreignKey: "author" });
users.hasMany(comments, { foreignKey: "author" });

comments.belongsTo(posts, { foreignKey: "post_id" });
posts.hasMany(likes, { foreignKey: "post_id" });

likes.belongsTo(users, { foreignKey: "author" });
users.hasMany(likes, { foreignKey: "author" });

posts.belongsTo(users, { foreignKey: "author" });
users.hasMany(posts, { foreignKey: "author" });

posts.belongsToMany(categories, { through: posts_categories, foreignKey: 'post_id',  as: 'categoryID' });
categories.belongsToMany(posts, { through: posts_categories, foreignKey: 'category_id', as: 'postID' });

sequelize
    .sync()
    .then(() => {
        console.log('DB was created');
    })
    .catch((err) => {
        console.log('Some error happend, during creating db: ', err);
    })

module.exports = { 
    sequelize : sequelize,
    users : users,
    posts : posts,
    comments : comments,
    likes : likes,
    posts : posts,
    categories : categories,
    posts_categories : posts_categories
};
