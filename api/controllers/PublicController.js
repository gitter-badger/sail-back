var is         = require('torf');
var passport   = require('passport');
var ForgotPass = require('../services/ForgotPass.js');
var Email      = require('../services/Email.js');

module.exports = {
	showHome: function (req, res) {

		res.view("pages/home", {user: req.session.user});
	},
	showSignIn: function (req, res) {

		if(req.session.user) {
			res.redirect("/");
		} else {
			res.view("pages/signin", {user: req.session.user});
		};
	},
	ServiceSignIn: function (req, res) {

		passport.authenticate('local', function (err, member, info) {

			if((err) || (!member)) {
				res.redirect('/signin');
			}else{
				req.session.user = member;
				req.session.authenticated = true;
				req.member = member;
				res.redirect('/admin');
			};
		})(req, res);
	},
	ServiceSignOut: function (req,res) {
		req.session.destroy(function (err){
			res.redirect('/');
		});
	},
	/**
	 *	
	 *
	**/
	forgotPassword: function (req, res) {

		// random string that will be
		// used to generate a password
		var randomString = "";

		var query = [
			{primary_email:   req.body['email']},
			{secondary_email: req.body['email']}
		];

		Members
		.findOne(query)
		.then(function (member) {

			if (!is.ok(member)) {
				throw new Error('Email not recognised.');
			} else {
				randomString     = ForgotPass.randomString();
				var hashPassword = ForgotPass.hash(randomString);
				return Members.update({id: member.id}, {password: hashPassword});
			}
		})
		.then(function (memberUpdated) {

			Email.sendPassword({
				password: randomString, 
				email: req.body['primary_email']
			}, function (error, result) {

				if(is.ok(error)) {
					res.send({emailSent: false, error: error})
				}

				if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
					res.send({emailSent: true, error: undefined, password: randomString});
				} else {
					res.send({emailSent: true, error: undefined});
				}
			})
		})
		.catch(function (error) {

			sails.log.error(error);
			res.send({emailSent: false, error: error});
		})
	}
};