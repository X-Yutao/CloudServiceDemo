/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'users',
  attributes: {
    id:{
      type: 'integer',
      autoIncrement: true
    },

    userName:{
      type: 'string'
    },

    password:{
      type: 'string'
    }
  },

};

