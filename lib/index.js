var events = require('events');
var fs = require('fs');
var Handlebars = require('handlebars');

var mod;

mod = function(input) {
	var htm;
	var tpl;
	var loaded = new events.EventEmitter();

	fs.readFile(input, function(err, data) {
		htm = data.toString();

		loaded.emit('loaded');
	});

	function out(err, req, res, lug) {
		if(typeof htm == 'undefined') {
			loaded.on('loaded', function() {
                if(!res.headersSent) {
                    res.writeHead(200, {'Content-type': 'text/html'});
                }

				// Compile
				tpl = Handlebars.compile(htm);

				// Output
				res.write(tpl(lug.vault));
				res.end();
			});
		} else {
            if(!res.headersSent) {
                res.writeHead(200, {'Content-type': 'text/html'});
            }

			// Compile
			tpl = Handlebars.compile(htm);

			// Output
			res.write(tpl(lug.vault));
			res.end();
		}
	};

	return out;
}

module.exports = mod;
