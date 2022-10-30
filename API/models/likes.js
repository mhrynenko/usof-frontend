const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('likes', {
        id : {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
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
        post_id : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        comment_id : {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'comments',
                key: 'id'
            }
        },
        type : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'likes',
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
            {
                name: "comment_id",
                using: "BTREE",
                fields: [
                    { name: "comment_id" },
                ]
            },
        ]
    });
};
