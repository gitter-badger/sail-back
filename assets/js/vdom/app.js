;(function () {
	"use strict";

	var utils = {
		is:            require("torf"),
		clean:         require("d-bap"),
		lazy:          require("lazy.js"),
		diff:          require('virtual-dom/diff'),
		patch:         require('virtual-dom/patch'),
		createElement: require('virtual-dom/create-element'),
		request:       require("./services/request.js"),
		upload:        require("upload-element"),
		moment:        require("moment"),
		observ:        require("observ"),
		observS:       require("observ-struct"),
		observA:       require("observ-array"),
		h:             require("virtual-dom/h"),
		$$:            require("./helpers").$$,
		createOpts:    require("./helpers").createOpts,
		replaceNice:   require("./helpers").replaceNice,
		lastSub:       require("./helpers").lastSub,
		orderPayments: require("./helpers").orderPayments,
		balanceDue:    require("./helpers").balanceDue
	};

	try{
		require("./pages/adminhome.js")(utils);
		require("./pages/member.page.js")(utils);
		require("./components/uploadcsv/index.js")(utils);
	} catch (e){
		console.log("Index: ", e)
	}
}());
