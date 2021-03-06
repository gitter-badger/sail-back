module.exports.routes = {
  'GET /testing': {
    controller: 'Test',
    action: 'test'
  },
  // -------------------------------------------------------------------------
  // Public
  // -------------------------------------------------------------------------
  'GET /api/current_events': {
    controller: 'Events',
    action: 'getCurrentEvents'
  },
  'GET /events': {
    controller: 'Events',
    action: 'showView'
  },
  'GET /event_info/:id': {
    controller: 'Events',
    action: 'showViewEvent'
  },
  'GET /api/event_info/:id': {
    controller: 'Events',
    action: 'singleEventInfo'
  },
  'GET /events/booked': {
    controller: 'Members',
    action: 'showMyEvents'
  },
  'GET /api/my_events': {
    controller: 'Members',
    action: 'getMyEvents'
  },
  // -------------------------------------------------------------------------
  // Events endpoints
  // -------------------------------------------------------------------------
  'POST /book_event': {
    controller: 'BookingRecords',
    action: 'book'
  },
  // -------------------------------------------------------------------------
  // SignIn process
  // -------------------------------------------------------------------------
  'GET /': {
    controller: 'Public',
    action: 'showHome'
  },
  'GET /user': {
    controller: 'Private',
    action: 'showUserHome'
  },
  'GET /signin': {
    controller: 'Public',
    action: 'showSignIn'
  },
  'GET /signout': {
    controller: 'Public',
    action: 'ServiceSignOut'
  },
  'POST /signin': {
    controller: 'Public',
    action: 'ServiceSignIn'
  },
  'POST /forgotPassword': {
    controller: 'Public',
    action: 'forgotPassword'
  },
  // -------------------------------------------------------------------------
  // SignUp process
  // -------------------------------------------------------------------------
  'GET /signup': {
    controller: 'SignUpProcess',
    action: 'showForm'
  },
  'POST /signup': {
    controller: 'SignUpProcess',
    action: 'create'
  },
  'GET /activate': {
    controller: 'SignUpProcess',
    action: 'activate'
  },
  // -------------------------------------------------------------------------
  // User endpoints
  // -------------------------------------------------------------------------
  'GET /account': {
    controller: 'Members',
    action: 'accountPage'
  },
  'GET /api/account': {
    controller: 'Members',
    action: 'accountInfo'
  },
  'PUT /api/account': {
    controller: 'Members',
    action: 'updateAccountInfo'
  },
  'POST /charge': {
    controller: 'Payments',
    action: 'charge'
  },
  'GET /client_token': {
    controller: 'Payments',
    action: 'clientToken'
  },
  'POST /paypal_payment': {
    controller: 'Payments',
    action: 'makePaypalPayment'
  },
  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------
  'GET /admin': {
    controller: 'Private',
    action: 'showAdminHome'
  },
  'GET /addmember': {
    controller: 'Private',
    action: 'showMemberForm'
  },
  'POST /addmember': {
    controller: 'Private',
    action: 'addmember'
  },
  'GET /members/:id': {
    controller: 'Private',
    action: 'showMember'
  },
  'GET /api/members/:id/events': {
    controller: 'Members', //to change
    action: 'admin_get_user_events'
  },
  'GET /maintenance': {
    controller: 'Private',
    action: 'showMaintenance'
  },
  'POST /upload': {
    controller: 'Private',
    action: 'upload'
  }
// -------------------------------------------------------------------------
}
