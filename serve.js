'use script'
const HTTP = require('http');
const EXPRES = require('express');
const SERVEINDEX = require('serve-index');
const APP = EXPRES();
APP.use(SERVEINDEX('./public'));
APP.use(EXPRES.static('./public'));
const HttpServe = HTTP.createServer(APP);
HttpServe.listen('1010','0.0.0.0');