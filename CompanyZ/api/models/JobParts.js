/**
 * JobParts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  
  tableName: 'jobparts',
  //primaryKey: 'partId',
  //primaryKey: 'jobName',
  primaryKey: 'time',
  attributes: {

    partId: { type: 'integer', required: true },
    jobName: { type: 'string', required: true },
    userId: {type: 'integer', required: true},
    qty: { type: 'integer', required: true },
    date: {type: 'string'},
    time: {type: 'string', required: true},
    result: {type: 'integer'}

  },


};

