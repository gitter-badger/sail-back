"use strict";

var test    = require("tape");
var request = require("supertest");
var Sails   = require("sails");
var helpers = require("./helpers.js");

var sails;
var Cookies;
var MEMBER;

test("Start server: ", function (t) {

	Sails.lift({
		log: {
			level: 'error'
		},
		models: {
			connection: 'test',
			migrate: 'drop'
		}
	}, function (err, serverStarted) {

		if(err) {
			throw err;
			t.end();
		} else {
			sails = serverStarted;
			t.ok(serverStarted, "..server started");
			t.end();
		}
	});
});

// test("Create hooks", function (t) {

// 	helpers(function (error, items) {

// 		t.ok(items, "mock entries created");
// 		t.end();
// 	});
// });

test("Sign up and get cookies", function (t) {

	var memberMock = {
		primary_email: "someone@email.com",
		membership_type: "annual-corporate",
		password: "secret"
	};

	request(sails.hooks.http.app)
	.post("/signup")
	.send(memberMock)
	.end(function (err, res) {

		Cookies = res.headers['set-cookie'].pop().split(';')[0];
		Members
		.findOne({primary_email: memberMock.primary_email})
		.exec(function (error, item) {

			MEMBER = item;
			t.end();
		});
	});
});

test("Get account info with cookies", function (t) {

	var req = request(sails.hooks.http.app).get("/api/account");

	req.cookies = Cookies;

	req.end(function (err, res) {

		t.equals(res.statusCode, 200, "got access");
		t.equals(res.body.primary_email, "someone@email.com", "got account info");
		t.end();
	});
});

test("Close to request without a valid session", function (t) {

	var req = request(sails.hooks.http.app).get("/api/account");

	req.end(function (err, res) {

		t.equals(res.statusCode, 404, "got 404");
		t.end();
	});
});

test("Make a payment", function (t) {

	var token;

	t.test("get client token", function (st) {

		var req = request(sails.hooks.http.app).get("/client_token");
		req.cookies = Cookies;
		req.end(function (err, res) {

			t.equals(res.statusCode, 200, "status ok");
			t.ok(res.body.token, "got token");

			token = res.body.token;

			st.end();
		});
	});

	t.test("make payment", function (st) {

		var fakePayment = {
			amount: 20,
			payment_method_nonce: "fake-valid-nonce",
			category: 'payment',
			member: MEMBER.id
		};

		var req     = request(sails.hooks.http.app).post("/paypal_payment");
		req.cookies = Cookies;

		req
		.send(fakePayment)
		.end(function (error, res) {

			// if(error) {
			// 	console.log("ERROR: ", error);
			// 	st.end();
			// 	return;
			// }

			st.equals(res.statusCode, 302, "status code 302");

			Members
			.findOne({primary_email: "someone@email.com"})
			.populateAll()
			.exec(function (err, item) {

				var lastPayment = item.payments[item.payments.length - 1];
				t.equals(lastPayment.category, 'payment', "right category");
				t.equals(lastPayment.amount, fakePayment.amount, "right amount");
				st.end();
			});
		});
	});
});

test("Low server: ", function (t) {

	t.ok("ok", "exit!")
	t.end();
	process.exit(0);
});