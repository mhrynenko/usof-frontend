const util = require('util')

async function proccesPagination (model, limit, page, attr) {
    let all;
    let pages;

    const customAttr = { ...attr};

    const { rows } = await model.findAndCountAll(customAttr);

    count = rows.length;
    pages = Math.ceil(count / limit);

    if (count > limit) {
        customAttr.limit = limit;
        customAttr.offset = page * limit;
    }
    // console.log(util.inspect(customAttr, false, null, true));
   
    all = await model.findAndCountAll(customAttr);

    let prev = page - 1;
    if (page == 0) {
        prev = 0;
    } 

    let next = page + 1;
    if (page + 1 === pages) {
        next = page;
    }

    all.count = count; //category filter breaks it down (fuck)
    all.pages = pages;
    
    return all;
}

async function setPostsCategories (modelCategories, modelPostsCategories, categories, post_id) {
    for (const category of categories) {
        const categoryDB = await modelCategories.findOne({
            where: { 
                title : category
            } 
        });

        await modelPostsCategories.findOrCreate({
            where : {
                post_id : post_id,
                category_id : categoryDB.dataValues.id 
            },
            defaults : {
                post_id : post_id,
                category_id : categoryDB.dataValues.id 
            }
        });
    }  
}

module.exports = {
    proccesPagination,
    setPostsCategories,
}