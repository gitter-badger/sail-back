/**
* DeletionReasons.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    description: {
      type: 'STRING'
    },
    value: {
      type: 'STRING',
      primaryKey: true
    },
    members: {
      collection: 'Members',
      via: 'deletion_reason'
    }
  }
}
