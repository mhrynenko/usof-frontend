const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('comments', {
        id : {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        post_id : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        author : {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: 'users',
                key: 'login'
            }
        },
        publish_date : {
            type: DataTypes.DATE,
            allowNull: false
        },
        content : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        files : {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
    }, {
        sequelize,
        tableName: 'comments',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "author",
                using: "BTREE",
                fields: [
                    { name: "author" },
                ]
            },
            {
                name: "post_id",
                using: "BTREE",
                fields: [
                    { name: "post_id" },
                ]
            },
        ]
    });
};
