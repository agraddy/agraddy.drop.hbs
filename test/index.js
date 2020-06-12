var tap = require('agraddy.test.tap')(__filename);
var response = require('agraddy.test.res');

var drop = require('../');
var routes = {};
var res = response();
var data = {};

process.chdir('test');

data.vault = {};
data.vault.data = {};
data.vault.config = {};
data.vault.data.title = 'HBS';

res.on('finish', function() {
	tap.assert.equal(res._body, '-HBS-\n', 'Should replace the {{data.title}}.');
});

drop('views/about.htm')(null, {}, res, data);


var res2 = response();
res2.on('finish', function() {
	tap.assert.equal(res2._statusCode, 422, 'Should return a different status code if set.');
});
res2.writeHead(422, {'Content-type': 'text/html'});
drop('views/about.htm')(null, {}, res2, data);


var res3 = response();
res3.on('finish', function() {
    tap.assert.equal(res3._body, 'HBS\n<p>Welcome</p>\n<p>Goodbye</p>\n', 'Should replace the {{data.title}}.');
});

data.vault = {};
data.vault.data = {};
data.vault.config = {};
data.vault.data.title = 'HBS';
data.vault.data.welcome = 'Welcome';
data.vault.data.goodbye = 'Goodbye';
drop('views/home.htm')(null, {}, res3, data);
