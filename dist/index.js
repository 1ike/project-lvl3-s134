'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import cheerio from 'cheerio';
// import Listr from 'listr';

var renderName = function renderName(inputURL) {
  var urlObject = _url2.default.parse(inputURL);
  var stage1 = urlObject.hostname + urlObject.pathname;
  var stage2 = stage1.replace(/[^a-zA-Z0-9]+/g, '-');
  var stage3 = stage2.replace(/-$/g, '');

  return stage3 + '.html';
};

var savePage = function savePage(inputURL) {
  var outputPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _process2.default.cwd();

  var name = renderName(inputURL);

  var result = _axios2.default.get(inputURL).then(function (response) {
    if (response.status !== 200) {
      throw new Error('Expected 200, but was ' + response.status + ' for \'' + inputURL + '\'');
    }

    return response.data;
  }).then(function (html) {
    var pathToFile = _path2.default.join(outputPath, name);

    return _fs2.default.writeFile(pathToFile, html);
  }).then(function () {
    console.log('Page was downloaded as \'' + name + '\'');
  });

  return result;
};

exports.default = savePage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZW5kZXJOYW1lIiwiaW5wdXRVUkwiLCJ1cmxPYmplY3QiLCJwYXJzZSIsInN0YWdlMSIsImhvc3RuYW1lIiwicGF0aG5hbWUiLCJzdGFnZTIiLCJyZXBsYWNlIiwic3RhZ2UzIiwic2F2ZVBhZ2UiLCJvdXRwdXRQYXRoIiwiY3dkIiwibmFtZSIsInJlc3VsdCIsImdldCIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsIkVycm9yIiwiZGF0YSIsImh0bWwiLCJwYXRoVG9GaWxlIiwiam9pbiIsIndyaXRlRmlsZSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUNBO0FBQ0E7O0FBRUEsSUFBTUEsYUFBYSxTQUFiQSxVQUFhLENBQUNDLFFBQUQsRUFBYztBQUMvQixNQUFNQyxZQUFZLGNBQUlDLEtBQUosQ0FBVUYsUUFBVixDQUFsQjtBQUNBLE1BQU1HLFNBQVNGLFVBQVVHLFFBQVYsR0FBcUJILFVBQVVJLFFBQTlDO0FBQ0EsTUFBTUMsU0FBU0gsT0FBT0ksT0FBUCxDQUFlLGdCQUFmLEVBQWlDLEdBQWpDLENBQWY7QUFDQSxNQUFNQyxTQUFTRixPQUFPQyxPQUFQLENBQWUsS0FBZixFQUFzQixFQUF0QixDQUFmOztBQUVBLFNBQVVDLE1BQVY7QUFDRCxDQVBEOztBQVNBLElBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDVCxRQUFELEVBQTBDO0FBQUEsTUFBL0JVLFVBQStCLHVFQUFsQixrQkFBUUMsR0FBUixFQUFrQjs7QUFDekQsTUFBTUMsT0FBT2IsV0FBV0MsUUFBWCxDQUFiOztBQUVBLE1BQU1hLFNBQVMsZ0JBQU1DLEdBQU4sQ0FBVWQsUUFBVixFQUNaZSxJQURZLENBQ1AsVUFBQ0MsUUFBRCxFQUFjO0FBQ2xCLFFBQUlBLFNBQVNDLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0IsWUFBTSxJQUFJQyxLQUFKLDRCQUFtQ0YsU0FBU0MsTUFBNUMsZUFBMkRqQixRQUEzRCxRQUFOO0FBQ0Q7O0FBRUQsV0FBT2dCLFNBQVNHLElBQWhCO0FBQ0QsR0FQWSxFQVFaSixJQVJZLENBUVAsVUFBQ0ssSUFBRCxFQUFVO0FBQ2QsUUFBTUMsYUFBYSxlQUFLQyxJQUFMLENBQVVaLFVBQVYsRUFBc0JFLElBQXRCLENBQW5COztBQUVBLFdBQU8sYUFBR1csU0FBSCxDQUFhRixVQUFiLEVBQXlCRCxJQUF6QixDQUFQO0FBQ0QsR0FaWSxFQWFaTCxJQWJZLENBYVAsWUFBTTtBQUNWUyxZQUFRQyxHQUFSLCtCQUF1Q2IsSUFBdkM7QUFDRCxHQWZZLENBQWY7O0FBaUJBLFNBQU9DLE1BQVA7QUFDRCxDQXJCRDs7a0JBdUJlSixRIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ216L2ZzJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHByb2Nlc3MgZnJvbSAncHJvY2Vzcyc7XG5cbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG4vLyBpbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcbi8vIGltcG9ydCBMaXN0ciBmcm9tICdsaXN0cic7XG5cbmNvbnN0IHJlbmRlck5hbWUgPSAoaW5wdXRVUkwpID0+IHtcbiAgY29uc3QgdXJsT2JqZWN0ID0gdXJsLnBhcnNlKGlucHV0VVJMKTtcbiAgY29uc3Qgc3RhZ2UxID0gdXJsT2JqZWN0Lmhvc3RuYW1lICsgdXJsT2JqZWN0LnBhdGhuYW1lO1xuICBjb25zdCBzdGFnZTIgPSBzdGFnZTEucmVwbGFjZSgvW15hLXpBLVowLTldKy9nLCAnLScpO1xuICBjb25zdCBzdGFnZTMgPSBzdGFnZTIucmVwbGFjZSgvLSQvZywgJycpO1xuXG4gIHJldHVybiBgJHtzdGFnZTN9Lmh0bWxgO1xufTtcblxuY29uc3Qgc2F2ZVBhZ2UgPSAoaW5wdXRVUkwsIG91dHB1dFBhdGggPSBwcm9jZXNzLmN3ZCgpKSA9PiB7XG4gIGNvbnN0IG5hbWUgPSByZW5kZXJOYW1lKGlucHV0VVJMKTtcblxuICBjb25zdCByZXN1bHQgPSBheGlvcy5nZXQoaW5wdXRVUkwpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAyMDAsIGJ1dCB3YXMgJHtyZXNwb25zZS5zdGF0dXN9IGZvciAnJHtpbnB1dFVSTH0nYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgIGNvbnN0IHBhdGhUb0ZpbGUgPSBwYXRoLmpvaW4ob3V0cHV0UGF0aCwgbmFtZSk7XG5cbiAgICAgIHJldHVybiBmcy53cml0ZUZpbGUocGF0aFRvRmlsZSwgaHRtbCk7XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgUGFnZSB3YXMgZG93bmxvYWRlZCBhcyAnJHtuYW1lfSdgKTtcbiAgICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2F2ZVBhZ2U7XG4iXX0=