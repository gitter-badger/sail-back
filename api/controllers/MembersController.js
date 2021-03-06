/* global
   Members, BookingRecords
*/

/**
 * MembersController
 *
 * @description :: Server-side logic for managing members
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Lazy = require('lazy.js')

module.exports = {
  accountPage: function (req, res) {
    res.view('pages/account', {user: req.session.user})
  },
  accountInfo: function (req, res) {
    Members
      .findOne(req.session.user.id)
      .populateAll()
      .exec(function (error, item) {
        if (error) {
          return res.notFound()
        } else {
          return res.send(item)
        }
      })
  },
  updateAccountInfo: function (req, res) {
    Members
      .update({
        primary_email: req.session.user.primary_email
      }, req.body)
      .exec(function (error, items) {
        if (error) {
          return res.serverError({error: error})
        } else {
          return res.send(items[0])
        }
      })
  },
  showMyEvents: function (req, res) {
    res.view('pages/myEvents', {user: req.session.user})},

  getMyEvents: function (req, res) {
    get_user_events(respond_with_event_data(res),
        req.session.user.id)},

  admin_get_user_events: function (req, res) {
    get_user_events(respond_with_event_data(res), req.param('id'))},

  get_user_events: get_user_events
}


function get_user_events (cb, id) {
  BookingRecords
    .find({head_member: id})
    .populate('event_id')
    .exec(cb) }

var respond_with_event_data = require('../../src/utils/curry')(function (res, err, data) {
  if (err) res.serverError({error: error})
  else res.send(require('../../src/utils/pluck')('event_id', data))})
