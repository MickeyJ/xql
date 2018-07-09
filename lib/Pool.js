"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _lodash = require("lodash");

var _Pool3 = require("mysql/lib/Pool");

var _Pool4 = _interopRequireDefault(_Pool3);

var _PoolConfig = require("mysql/lib/PoolConfig");

var _PoolConfig2 = _interopRequireDefault(_PoolConfig);

var _Query = require("./Query");

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cacheClientMethods = ['get', 'set', 'clear'];

_Pool4.default.prototype.query = _util2.default.promisify(_Pool4.default.prototype.query);

var Pool = function (_Pool2) {
    (0, _inherits3.default)(Pool, _Pool2);

    function Pool(config, cacheClient) {
        (0, _classCallCheck3.default)(this, Pool);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Pool.__proto__ || (0, _getPrototypeOf2.default)(Pool)).call(this, { config: new _PoolConfig2.default(config) }));

        if (!cacheClient) {
            throw new Error('Pool cacheClient is required');
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(cacheClientMethods), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var methodKey = _step.value;

                var method = cacheClient[methodKey];
                if (!(0, _lodash.isFunction)(method)) {
                    throw new TypeError("Pool cacheClient must have the following functions: [\"" + cacheClientMethods.join('", "') + "\"]");
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        _this.cache = cacheClient;
        return _this;
    }

    (0, _createClass3.default)(Pool, [{
        key: "Q",
        value: function Q(string) {
            return new _Query2.default(this, string);
        }
    }, {
        key: "transaction",
        value: function transaction(cb) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                _this2.getConnection(function (connError, connection) {
                    if (connError) {
                        reject(connError);
                        return;
                    }

                    var query = makeQueryPromise(connection);

                    connection.beginTransaction(function () {
                        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(e) {
                            var results;
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            if (!e) {
                                                _context.next = 4;
                                                break;
                                            }

                                            connection.release();
                                            reject(e);
                                            return _context.abrupt("return");

                                        case 4:
                                            results = void 0;
                                            _context.prev = 5;
                                            _context.next = 8;
                                            return cb(query);

                                        case 8:
                                            results = _context.sent;
                                            _context.next = 15;
                                            break;

                                        case 11:
                                            _context.prev = 11;
                                            _context.t0 = _context["catch"](5);

                                            connection.rollback(function () {
                                                connection.release();
                                                reject(_context.t0);
                                            });
                                            return _context.abrupt("return");

                                        case 15:

                                            connection.commit(function (e) {
                                                if (e) {
                                                    connection.rollback(function () {
                                                        connection.release();
                                                        reject(e);
                                                    });
                                                    return;
                                                }
                                                connection.release();
                                                resolve(results);
                                            });

                                        case 16:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this2, [[5, 11]]);
                        }));

                        return function (_x) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                });
            });
        }
    }]);
    return Pool;
}(_Pool4.default);

exports.default = Pool;

module.exports = Pool;

function makeQueryPromise(connection) {
    return function (queryString, inserts) {
        return new _promise2.default(function (resolve, reject) {
            connection.query(queryString, inserts, function (error, data) {
                if (error) return reject(error);
                resolve(data);
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvb2wuanMiXSwibmFtZXMiOlsiY2FjaGVDbGllbnRNZXRob2RzIiwiX1Bvb2wiLCJwcm90b3R5cGUiLCJxdWVyeSIsInV0aWwiLCJwcm9taXNpZnkiLCJQb29sIiwiY29uZmlnIiwiY2FjaGVDbGllbnQiLCJQb29sQ29uZmlnIiwiRXJyb3IiLCJtZXRob2RLZXkiLCJtZXRob2QiLCJUeXBlRXJyb3IiLCJqb2luIiwiY2FjaGUiLCJzdHJpbmciLCJRdWVyeSIsImNiIiwicmVzb2x2ZSIsInJlamVjdCIsImdldENvbm5lY3Rpb24iLCJjb25uRXJyb3IiLCJjb25uZWN0aW9uIiwibWFrZVF1ZXJ5UHJvbWlzZSIsImJlZ2luVHJhbnNhY3Rpb24iLCJlIiwicmVsZWFzZSIsInJlc3VsdHMiLCJyb2xsYmFjayIsImNvbW1pdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJxdWVyeVN0cmluZyIsImluc2VydHMiLCJlcnJvciIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsQ0FDdkIsS0FEdUIsRUFFdkIsS0FGdUIsRUFHdkIsT0FIdUIsQ0FBM0I7O0FBTUFDLGVBQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLEdBQXdCQyxlQUFLQyxTQUFMLENBQWVKLGVBQU1DLFNBQU4sQ0FBZ0JDLEtBQS9CLENBQXhCOztJQUVxQkcsSTs7O0FBQ2pCLGtCQUFZQyxNQUFaLEVBQW9CQyxXQUFwQixFQUFnQztBQUFBOztBQUFBLHNJQUN0QixFQUFDRCxRQUFRLElBQUlFLG9CQUFKLENBQWVGLE1BQWYsQ0FBVCxFQURzQjs7QUFHNUIsWUFBRyxDQUFDQyxXQUFKLEVBQWdCO0FBQ1osa0JBQU0sSUFBSUUsS0FBSixDQUFVLDhCQUFWLENBQU47QUFDSDtBQUwyQjtBQUFBO0FBQUE7O0FBQUE7QUFNNUIsNERBQXVCVixrQkFBdkIsNEdBQTBDO0FBQUEsb0JBQWhDVyxTQUFnQzs7QUFDdEMsb0JBQU1DLFNBQVNKLFlBQVlHLFNBQVosQ0FBZjtBQUNBLG9CQUFHLENBQUMsd0JBQVdDLE1BQVgsQ0FBSixFQUF1QjtBQUNuQiwwQkFBTSxJQUFJQyxTQUFKLDZEQUF1RWIsbUJBQW1CYyxJQUFuQixDQUF3QixNQUF4QixDQUF2RSxTQUFOO0FBQ0g7QUFDSjtBQVgyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVk1QixjQUFLQyxLQUFMLEdBQWFQLFdBQWI7QUFaNEI7QUFhL0I7Ozs7MEJBQ0NRLE0sRUFBTztBQUNMLG1CQUFPLElBQUlDLGVBQUosQ0FBVSxJQUFWLEVBQWdCRCxNQUFoQixDQUFQO0FBQ0g7OztvQ0FDV0UsRSxFQUFHO0FBQUE7O0FBQ1gsbUJBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLHVCQUFLQyxhQUFMLENBQW1CLFVBQUNDLFNBQUQsRUFBWUMsVUFBWixFQUEyQjtBQUMxQyx3QkFBR0QsU0FBSCxFQUFhO0FBQ1RGLCtCQUFPRSxTQUFQO0FBQ0E7QUFDSDs7QUFFRCx3QkFBTW5CLFFBQVFxQixpQkFBaUJELFVBQWpCLENBQWQ7O0FBRUFBLCtCQUFXRSxnQkFBWDtBQUFBLDRHQUE0QixpQkFBT0MsQ0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpREFDcEJBLENBRG9CO0FBQUE7QUFBQTtBQUFBOztBQUVwQkgsdURBQVdJLE9BQVg7QUFDQVAsbURBQU9NLENBQVA7QUFIb0I7O0FBQUE7QUFPcEJFLG1EQVBvQjtBQUFBO0FBQUE7QUFBQSxtREFTSlYsR0FBR2YsS0FBSCxDQVRJOztBQUFBO0FBU3BCeUIsbURBVG9CO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBV3BCTCx1REFBV00sUUFBWCxDQUFvQixZQUFNO0FBQ3RCTiwyREFBV0ksT0FBWDtBQUNBUDtBQUNILDZDQUhEO0FBWG9COztBQUFBOztBQWtCeEJHLHVEQUFXTyxNQUFYLENBQWtCLFVBQVVKLENBQVYsRUFBYTtBQUMzQixvREFBSUEsQ0FBSixFQUFPO0FBQ0hILCtEQUFXTSxRQUFYLENBQW9CLFlBQVk7QUFDNUJOLG1FQUFXSSxPQUFYO0FBQ0FQLCtEQUFPTSxDQUFQO0FBQ0gscURBSEQ7QUFJQTtBQUNIO0FBQ0RILDJEQUFXSSxPQUFYO0FBQ0FSLHdEQUFRUyxPQUFSO0FBQ0gsNkNBVkQ7O0FBbEJ3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFBNUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE4QkgsaUJBdENEO0FBdUNILGFBeENNLENBQVA7QUF5Q0g7OztFQTVENkIzQixjOztrQkFBYkssSTs7QUE4RHJCeUIsT0FBT0MsT0FBUCxHQUFpQjFCLElBQWpCOztBQUVBLFNBQVNrQixnQkFBVCxDQUEwQkQsVUFBMUIsRUFBcUM7QUFDakMsV0FBTyxVQUFTVSxXQUFULEVBQXNCQyxPQUF0QixFQUE4QjtBQUNqQyxlQUFPLHNCQUFZLFVBQUNmLE9BQUQsRUFBVUMsTUFBVixFQUFvQjtBQUNuQ0csdUJBQVdwQixLQUFYLENBQWtCOEIsV0FBbEIsRUFBK0JDLE9BQS9CLEVBQXdDLFVBQUNDLEtBQUQsRUFBUUMsSUFBUixFQUFnQjtBQUNwRCxvQkFBR0QsS0FBSCxFQUFVLE9BQU9mLE9BQU9lLEtBQVAsQ0FBUDtBQUNWaEIsd0JBQVFpQixJQUFSO0FBQ0gsYUFIRDtBQUlILFNBTE0sQ0FBUDtBQU1ILEtBUEQ7QUFRSCIsImZpbGUiOiJQb29sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgX1Bvb2wgZnJvbSAnbXlzcWwvbGliL1Bvb2wnXG5pbXBvcnQgUG9vbENvbmZpZyBmcm9tICdteXNxbC9saWIvUG9vbENvbmZpZyc7XG5pbXBvcnQgUXVlcnkgZnJvbSAnLi9RdWVyeSdcblxuY29uc3QgY2FjaGVDbGllbnRNZXRob2RzID0gW1xuICAgICdnZXQnLFxuICAgICdzZXQnLFxuICAgICdjbGVhcicsXG5dO1xuXG5fUG9vbC5wcm90b3R5cGUucXVlcnkgPSB1dGlsLnByb21pc2lmeShfUG9vbC5wcm90b3R5cGUucXVlcnkpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sIGV4dGVuZHMgX1Bvb2x7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBjYWNoZUNsaWVudCl7XG4gICAgICAgIHN1cGVyKHtjb25maWc6IG5ldyBQb29sQ29uZmlnKGNvbmZpZyl9KTtcblxuICAgICAgICBpZighY2FjaGVDbGllbnQpe1xuICAgICAgICAgICAgdGhyb3cobmV3IEVycm9yKCdQb29sIGNhY2hlQ2xpZW50IGlzIHJlcXVpcmVkJykpXG4gICAgICAgIH1cbiAgICAgICAgZm9yKGNvbnN0IG1ldGhvZEtleSBvZiBjYWNoZUNsaWVudE1ldGhvZHMpe1xuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gY2FjaGVDbGllbnRbbWV0aG9kS2V5XTtcbiAgICAgICAgICAgIGlmKCFpc0Z1bmN0aW9uKG1ldGhvZCkpe1xuICAgICAgICAgICAgICAgIHRocm93KG5ldyBUeXBlRXJyb3IoYFBvb2wgY2FjaGVDbGllbnQgbXVzdCBoYXZlIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOiBbXCIke2NhY2hlQ2xpZW50TWV0aG9kcy5qb2luKCdcIiwgXCInKX1cIl1gKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlID0gY2FjaGVDbGllbnQ7XG4gICAgfVxuICAgIFEoc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG5ldyBRdWVyeSh0aGlzLCBzdHJpbmcpO1xuICAgIH1cbiAgICB0cmFuc2FjdGlvbihjYil7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENvbm5lY3Rpb24oKGNvbm5FcnJvciwgY29ubmVjdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGNvbm5FcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChjb25uRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBtYWtlUXVlcnlQcm9taXNlKGNvbm5lY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnJlbGVhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGF3YWl0IGNiKHF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucm9sbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbi5jb21taXQoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbi5yb2xsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbi5yZWxlYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFBvb2w7XG5cbmZ1bmN0aW9uIG1ha2VRdWVyeVByb21pc2UoY29ubmVjdGlvbil7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHF1ZXJ5U3RyaW5nLCBpbnNlcnRzKXtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xuICAgICAgICAgICAgY29ubmVjdGlvbi5xdWVyeSggcXVlcnlTdHJpbmcsIGluc2VydHMsIChlcnJvciwgZGF0YSkgPT57XG4gICAgICAgICAgICAgICAgaWYoZXJyb3IpIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiJdfQ==
