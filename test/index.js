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
