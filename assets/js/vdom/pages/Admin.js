"use strict";

var nuclear = require("nuclear.js");
var h       = nuclear.h;
var utils   = require("../utils.js");

var page    = require("../components/admin/member-panel.js");

module.exports = Admin;

var route;

function Admin (initialState) {

	initialState = initialState          || {};
	var member   = initialState.member   || {};
	var payments = initialState.payments || {};
	var bookings = initialState.bookings || {};
	var events   = initialState.events   || {};

	var state = nuclear.observS({
		route:       nuclear.observ(""),
		member:      nuclear.observS(member),
		payments:    nuclear.observA(payments),
		bookings:    nuclear.observA(bookings),
		events:      nuclear.observA(events),
		modeMember:  nuclear.observ("viewMember"),
		modePayment: nuclear.observ("viewPayment"),
		channels: {
			deletePayment: deletePayment
		}
	});

	route = nuclear.router(state);

	return state;
}

function deletePayment (state, paymentId) {

	nuclear.request({
		method: "DELETE",
		url: "/api/payments/" + paymentId
	}, function (error, header, body) {

		if(error) {
			alert("Error deleting payments");
		} else {
			var paymentsArray = state.payments();
			var index = paymentsArray.map(function (elm) {return elm.id}).indexOf(JSON.parse(body).id);
			paymentsArray.splice(index, 1);
			state.payments.set(paymentsArray);
		}
	})
}

Admin.render = function (state) {

	return (
		h("div", [
			h("div.main-container#member-component", [
				h("div.inner-section-divider-medium"),
				h("div.section-label", [
					h("h1", "Member info")
				]),
				h("div.inner-section-divider-medium"),
				page[state.modeMember()](state),
				h("div.inner-section-divider-medium"),
				renderPayment(state),
				h("div.inner-section-divider-medium"),
				renderEvents(state)
			])
		])
	);
};

function renderPayment (state) {
	if (state.modeMember() === "editMember") {
		return "";
	} else {
		return (
			h("div", [
				h("div.section-label", [
					h("h1", "Payment info")
				]),
				h("div.inner-section-divider-medium"),
				h("div.flex", [
					h("button#subscription_btn.btn-primary.w-3",{
						onclick: function () {
							return state.modePayment.set("subscription")
						}
					}, "+ Subscription"),
					h("button#donation_btn.btn-primary.w-3", {
						onclick: function () {
							return state.modePayment.set("donation")
						}
					},"+ Donation"),
					h("button#payment_btn.btn-primary.w-3", {
						onclick: function () {
							return state.modePayment.set("payment")
						}
					},"+ Payment")
				]),
				h("div.inner-section-divider-medium"),
				page[state.modePayment()](state)
			])
		);
	}
}

function renderEvents (state) {

	return (
		h("div", [
			h("div.section-label", [
				h("h1", "Events")
			]),
			h("div.inner-section-divider-medium"),
			h("div#table-payments", [
				h("div.table-section-individual", [
					h("div.table-section-individual-header", [
						h("div.col-3", [
							h("h3", "Date")
						]),
						h("div.col-2", [
							h("h3", "Ref")
						]),
						h("div.col-1", [
							h("h3", "Description")
						]),
						h("div.col-3", [
							h("h3", "Time")
						]),
						h("div.col-4", [
							h("h3", "Location")
						]),
						h("div.col-5", [
							h("h3", "Host")
						]),
						h("div.col-6", [
							h("h3", "Price member")
						]),
						h("div.col-6", [
							h("h3", "Price guest")
						])
					]),
					h("div.table-section-individual-rows", renderRowsEvents(state))
				])
			])
		])
	);
}

function renderRowsEvents (state) {

	var events = utils.processEvents(state.events());

	return events.map(function (elm) {

		return (
			h("div.row", [
				h("div.col-3", [
					h("p", elm.date)
				]),
				h("div.col-2", [
					h("p", elm.reference)
				]),
				h("div.col-1", [
					h("p", elm.title)
				]),
				h("div.col-3", [
					h("p", elm.time)
				]),
				h("div.col-4", [
					h("p", elm.location)
				]),
				h("div.col-5", [
					h("p", elm.host)
				]),
				h("div.col-6", [
					h("p", String(elm.price_per_member))
				]),
				h("div.col-6", [
					h("p", String(elm.price_per_guest))
				])
			])
		);
	});
}