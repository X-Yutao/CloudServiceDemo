/**
 * search.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    primaryKey: 'jobName',
    attributes: {
  
      jobName: { type: 'string', required: true },
      date: { type : 'string', required: true },
      month: { type : 'string', required: true},
    },

};