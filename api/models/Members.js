/*global
  sails
*/

/**
* Members.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

/**
 *	Starred properties are required. The requirements
 *	will be done programmatically on the front end.
 *	This because uploaded data are don't meet the
 *	requirements.
 */

var bcrypt = require('bcryptjs')
var is = require('torf')

module.exports = {
  attributes: {
    // ------------------------------------------------------------
    // Original data
    // ------------------------------------------------------------
    id: {
      type: 'STRING',
      required: true,
      unique: true,
      primaryKey: true
    },
    /* Required */
    title: {
      type: 'STRING'
    },
    /* Required */
    initials: {
      type: 'STRING'
    },
    /* Required */
    last_name: {
      type: 'STRING'
    },
    first_name: {
      type: 'STRING'
    },
    address1: {
      type: 'STRING'
    },
    address2: {
      type: 'STRING'
    },
    address3: {
      type: 'STRING'
    },
    address4: {
      type: 'STRING'
    },
    county: {
      type: 'STRING'
    },
    /* Required */
    postcode: {
      type: 'STRING'
    },
    deliverer: {
      type: 'STRING'
    },
    home_phone: {
      type: 'STRING'
    },
    mobile_phone: {
      type: 'STRING'
    },
    work_phone: {
      type: 'STRING'
    },
    /* Required */
    primary_email: {
      type: 'STRING',
      unique: true
    },
    /* Required */
    /**
     *	Apparently there are some
     *	entries with the same
     *	secondary email
     *
     */
    secondary_email: {
      type: 'STRING'
    },
    email_bounced: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    date_joined: {
      type: 'DATE'
    },
    membership_type: {
      model: 'MembershipTypes'
    },
    date_membership_type_changed: {
      type: 'DATE'
    },
    life_payment_date: {
      type: 'DATE'
    },
    notes: {
      type: 'TEXT'
    },
    /* Required */
    gift_aid_signed: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    date_gift_aid_signed: {
      type: 'DATE'
    },
    gift_aid_cancelled: {
      type: 'BOOLEAN',
      defaultsTo: false
    },
    date_gift_aid_cancelled: {
      type: 'DATE'
    },
    standing_order: {
      type: 'BOOLEAN'
    },
    activation_status: {
      type: 'STRING',
      enum: ['created', 'activated', 'deactivated'],
      defaultsTo: 'activated'
    },
    // ------------------------------------------------------------
    // Additional data
    // ------------------------------------------------------------
    password: {
      type: 'STRING'
    },
    /**
     *	Whether the member has selected to receive news
     *	by email or by post. This defaults to post which
     *  means each member MUST supply an address.
     */
    news_type: {
      type: 'STRING',
      enum: ['post', 'online'],
      defaultsTo: 'post'
    },
    /**
     *	The date when the next subscription payment
     *	is due. By default is the 01/Jan of the following
     *	year.
     *	Example: a member has its due date on the 01/Jan/20xx
     *	if he decides to pay in advance, at the date yy/yy/yyyy
     *	the new due date will become that day + one year
     *	i.e. yy/yy/(yyyy + 1)
     */
    due_date: {
      type: 'DATE'
    // defaultsTo: first of January next year
    },
    /**
     *	This differentiate whether a member has
     *	created an online account.
     *	By default is 'unregistered' only if the
     *	member is created by an 'admin' or uploaded.
     */
    registered: {
      type: 'STRING',
      enum: ['registered', 'unregistered'],
      defaultsTo: 'unregistered'
    },
    /**
     *  This is the date that the member's
     *  {activation_status} was set to "deactivated"
     */
    deletion_date: {
      type: 'DATE'
    },
    privileges: {
      type: 'STRING',
      enum: ['member', 'admin'],
      defaultsTo: 'member'
    },
    /**
     *  When the member signs up, they get an activation
     *  email with an activation code. This is the date
     *  when they click the activation code.
     */
    activation_date: {
      type: 'DATE'
    },
    // ------------------------------------------------------------
    // Relations
    // ------------------------------------------------------------
    deletion_reason: {
      model: 'DeletionReasons'
    },
    activation_codes: {
      collection: 'ActivationCodes',
      via: 'member'
    },
    reset_password_codes: {
      collection: 'ResetPassCodes',
      via: 'member'
    },
    payments: {
      collection: 'Payments',
      via: 'member'
    },
    events_booked: {
      collection: 'BookingRecords',
      via: 'head_member'
    },
    // ------------------------------------------------------------
    // Methods
    // ------------------------------------------------------------
    toJSON: function () {
      var obj = this.toObject()
      // Remove the password object value
      delete obj.password
      delete obj.reset_password_codes
      delete obj.activation_codes
      // return the new object without password
      obj.full_name = (obj.first_name || '') + ' ' + (obj.last_name || '')
      return obj
    }
  // ------------------------------------------------------------
  },
  beforeCreate: function (member, cb) {
    if (is.ok(member.password)) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(member.password, salt, function (err, hash) {
          if (err) {
            sails.log.error(err)
            cb(err)
          } else {
            member.password = hash
            cb(null, member)
          }
        })
      })
    } else {
      cb(null, member)
    }
  }
}
