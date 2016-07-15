var _stylus = require('stylus');
var sander = require('sander');
var Promise = sander.Promise;
var path = require('path');

var hasProp = {}.hasOwnProperty;

module.exports = function stylus(inputdir, outputdir, userOptions) {
  if (!userOptions.entry) {
    throw new Error('You must supply options.entry');
  }

  var options = {};
  for (var option in userOptions) {
    if (!hasProp.call(userOptions, option)) continue;
    options[option] = userOptions[option];
  }

  var entry = path.resolve(inputdir, options.entry);
  var dest = path.resolve(outputdir, options.dest || options.entry.slice(0, options.entry.lastIndexOf(path.extname(options.entry))) + ".css");
  delete options.entry;
  delete options.dest;

  var paths = [inputdir].concat(options.paths || []);
  delete options.paths;

  var define = options.define || {};
  delete options.define;

  var use = [].concat(options.use || []);
  delete options.use;

  var imports = [].concat(options["import"] || []);
  delete options["import"];

  var sourcemap = options.sourcemap || true;
  delete options.sourcemap;

  return sander.readFile(entry, {encoding: "utf8"}).then(function(code) {
    var style = _stylus(code, options)
      .set('filename', path.basename(entry))
      .set('paths', paths)
      .set('sourcemap', {comment: false});
    
    for (var name in define) {
      style = style.define(name, define[name]);
    }

    for (var j = 0, len = imports.length; j < len; j++) {
      var file = imports[j];
      style = style["import"](file);
    }

    for (var k = 0, len1 = use.length; k < len1; k++) {
      style = style.use(use[k]);
    }

    return new Promise(function(resolve, reject) {
      return style.render(function(err, css) {
        if (err) return reject(err)
        return resolve([css, style.sourcemap]);
      });
    });
  }).then(function(arg) {
    var css = arg[0], sourcemapSrc = arg[1];
    return Promise.all([sander.writeFile(dest, css, {encoding: "utf8"}), sourcemap ? sander.writeFile(dest + ".map", JSON.stringify(sourcemapSrc), {encoding: "utf8"}) : void 0]);
  });
};
