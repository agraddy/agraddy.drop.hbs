var events = require('events');
var fs = require('fs');
var Handlebars = require('handlebars');
var path = require('path');

var mod;

mod = function(input) {
	var htm;
	var tpl;
	var loaded = new events.EventEmitter();
	var partials = new events.EventEmitter();
    var partials_loaded = 0;

    // Load partials
    fs.readdir(path.normalize('views/partials'), function(err, files) {
        if(files && files.length) {
            partials_loaded = files.length;
            files.forEach(function(file) {
                fs.readFile(path.normalize('views/partials/' + file), function(err, data) {
                    var contents = data.toString();
                    var name = path.basename(file, path.extname(file));
                    Handlebars.registerPartial(name, contents);
                    partials_loaded--;

                    if(partials_loaded == 0) {
                        partials.emit('ready');
                    }
                });
            });
        } else {
            partials.emit('ready');
        }
    });

    partials.on('ready', function() {
            fs.readFile(input, function(err, data) {
                htm = data.toString();

                loaded.emit('loaded');
            });
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
