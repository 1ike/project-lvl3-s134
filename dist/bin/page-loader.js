#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.0').description('Saving page for offline using.').option('-o, --output [path]', 'Path for saving page').arguments('<url>').action(function (url) {
  return (0, _2.default)(url, _commander2.default.output);
}).parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vcGFnZS1sb2FkZXIuanMiXSwibmFtZXMiOlsidmVyc2lvbiIsImRlc2NyaXB0aW9uIiwib3B0aW9uIiwiYXJndW1lbnRzIiwiYWN0aW9uIiwidXJsIiwib3V0cHV0IiwicGFyc2UiLCJwcm9jZXNzIiwiYXJndiIsImFyZ3MiLCJsZW5ndGgiLCJoZWxwIl0sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBRUE7Ozs7OztBQUVBLG9CQUNHQSxPQURILENBQ1csT0FEWCxFQUVHQyxXQUZILENBRWUsZ0NBRmYsRUFHR0MsTUFISCxDQUdVLHFCQUhWLEVBR2lDLHNCQUhqQyxFQUlHQyxTQUpILENBSWEsT0FKYixFQUtHQyxNQUxILENBS1U7QUFBQSxTQUFPLGdCQUFLQyxHQUFMLEVBQVUsb0JBQVFDLE1BQWxCLENBQVA7QUFBQSxDQUxWLEVBTUdDLEtBTkgsQ0FNU0MsUUFBUUMsSUFOakI7O0FBUUEsSUFBSSxDQUFDLG9CQUFRQyxJQUFSLENBQWFDLE1BQWxCLEVBQTBCLG9CQUFRQyxJQUFSIiwiZmlsZSI6InBhZ2UtbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmltcG9ydCBwcm9ncmFtIGZyb20gJ2NvbW1hbmRlcic7XG5cbmltcG9ydCBsb2FkIGZyb20gJy4uLyc7XG5cbnByb2dyYW1cbiAgLnZlcnNpb24oJzAuMC4wJylcbiAgLmRlc2NyaXB0aW9uKCdTYXZpbmcgcGFnZSBmb3Igb2ZmbGluZSB1c2luZy4nKVxuICAub3B0aW9uKCctbywgLS1vdXRwdXQgW3BhdGhdJywgJ1BhdGggZm9yIHNhdmluZyBwYWdlJylcbiAgLmFyZ3VtZW50cygnPHVybD4nKVxuICAuYWN0aW9uKHVybCA9PiBsb2FkKHVybCwgcHJvZ3JhbS5vdXRwdXQpKVxuICAucGFyc2UocHJvY2Vzcy5hcmd2KTtcblxuaWYgKCFwcm9ncmFtLmFyZ3MubGVuZ3RoKSBwcm9ncmFtLmhlbHAoKTtcbiJdfQ==