const { DataTypes } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt-helpers')

module.exports = function(sequelize) {
    return sequelize.define('users', {
        id : {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        login : {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: "login"
        },
        password : {
            type: DataTypes.STRING(255),
            allowNull: false,
            set(value) {
                const hash = hashPassword(value);
                this.setDataValue("password", hash);
            },
        },
        full_name : {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email : {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: "email"
        },
        profile_picture : {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rating : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        role : {
            type: DataTypes.ENUM('admin','user'),
            allowNull: false,
            defaultValue: "user"
        },
        token : {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        confirmedEmail : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'users',
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
                name: "login",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "login" },
                ]
            },
            {
                name: "email",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "email" },
                ]
            },
        ]
    });
};
