const Sequelize = require('sequelize')

const filterActive = (status) => { //active inactive
    if (status === 'user') {
        return {
            where : {
                status : 'active'
            }
        }
    }
}

const byLikes = (order) => { //DESC ASC
    return {
        order : [[Sequelize.literal('likes'), order]]
    }
};

const byDate = (order) => { //DESC ASC
    return {
        order : [['publish_date', order]]
    } 
};

const filterDateBetween = (from, to) => { //EXAMPLE '2022-09-24' - '2022-09-25'
    if (Date.parse(to) < Date.parse(from)) {
        from = [to, to = from][0];
    }
    return {
        where : {
            publish_date : {
                [Sequelize.Op.between] : [new Date(from), new Date(to)]
            }
        }
    }
};

const filterStatus = (status) => { //active inactive
    return {
        where : {
            status : status
        }
    }
};

function filterCategory (modelCategory, categoriesArr) {  //EXAMPLE categories [`javascript`, `js`]
    return {
        attributes: [
            'id', 'author', 'title',
            'publish_date', 'status',
            'content', 'categories',
        ],
        include: [{
            model : modelCategory, 
            required: true,
            as : 'categoryID',
            attributes : [],
            where: { 
                title : categoriesArr,
            },
            through: {
                attributes: []
            },
        }],
        group : "posts.id",
        having : Sequelize.literal(`COUNT(*)=${categoriesArr.length}`),
    }
}

module.exports = {
    filterActive, 
    byLikes,
    byDate,
    filterCategory,
    filterDateBetween,
    filterStatus,
}