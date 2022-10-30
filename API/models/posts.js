const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('posts', {
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
        title : {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        publish_date : {
            type: DataTypes.DATE,
            allowNull: false
        },
        status : {
            type: DataTypes.ENUM('active','inactive'),
            allowNull: false,
            defaultValue: "active"
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
        categories : {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'posts',
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
        ]
    });
};
