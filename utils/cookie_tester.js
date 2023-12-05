"use strict";

import { Router } from "express";

function cookie_tester (req, res) {
	if (req.session.view) req.session.view++;
	else req.session.view = 1;

	res.send(`You have visited this page ${req.session.view} times`);
}

export default Router().get("/cookie", cookie_tester);