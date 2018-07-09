"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Query = function () {
    function Query(pool, string) {
        (0, _classCallCheck3.default)(this, Query);
        this._cacheKey = null;
        this._cacheEnabled = false;
        this._cacheClearEnabled = false;

        this._pool = pool;
        this._string = string;
    }

    (0, _createClass3.default)(Query, [{
        key: "query",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _args = arguments;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.pool.query.apply(this.pool, _args);

                            case 2:
                                return _context.abrupt("return", _context.sent);

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function query() {
                return _ref.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: "cache",
        value: function cache() {
            var cacheKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

            if (this._cacheKey !== cacheKey) {
                this._cacheKey = cacheKey;
                this._cacheEnabled = true;
            }
            return this;
        }
    }, {
        key: "clearCache",
        value: function clearCache(cacheKey) {
            this.pool.cache.clear(cacheKey);
            return this;
        }
    }, {
        key: "exec",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var cachedData, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this._cacheEnabled) {
                                    _context2.next = 9;
                                    break;
                                }

                                // if there's anything in the cache use it
                                cachedData = this.pool.cache.get(this._cacheKey);

                                if (!cachedData) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt("return", cachedData);

                            case 4:
                                _context2.next = 6;
                                return this.query(this._string, args);

                            case 6:
                                result = _context2.sent;

                                this.pool.cache.set(this._cacheKey, result);
                                return _context2.abrupt("return", result);

                            case 9:

                                if (this._cacheClearEnabled) {
                                    this.pool.cache.clear(this._cacheKey);
                                }

                                _context2.next = 12;
                                return this.query(this._string, args);

                            case 12:
                                return _context2.abrupt("return", _context2.sent);

                            case 13:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function exec() {
                return _ref2.apply(this, arguments);
            }

            return exec;
        }()
    }, {
        key: "pool",
        get: function get() {
            return this._pool;
        }
    }, {
        key: "cacheKey",
        get: function get() {
            return this._cacheKey;
        }
    }, {
        key: "cacheEnabled",
        get: function get() {
            return this._cacheEnabled;
        }
    }, {
        key: "cacheClearEnabled",
        get: function get() {
            return this._cacheClearEnabled;
        }
    }]);
    return Query;
}();

exports.default = Query;

module.exports = Query;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlF1ZXJ5LmpzIl0sIm5hbWVzIjpbIlF1ZXJ5IiwicG9vbCIsInN0cmluZyIsIl9jYWNoZUtleSIsIl9jYWNoZUVuYWJsZWQiLCJfY2FjaGVDbGVhckVuYWJsZWQiLCJfcG9vbCIsIl9zdHJpbmciLCJxdWVyeSIsImFwcGx5IiwiY2FjaGVLZXkiLCJjYWNoZSIsImNsZWFyIiwiYXJncyIsImNhY2hlZERhdGEiLCJnZXQiLCJyZXN1bHQiLCJzZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDcUJBLEs7QUFLakIsbUJBQVlDLElBQVosRUFBa0JDLE1BQWxCLEVBQXlCO0FBQUE7QUFBQSxhQUp6QkMsU0FJeUIsR0FKYixJQUlhO0FBQUEsYUFIekJDLGFBR3lCLEdBSFQsS0FHUztBQUFBLGFBRnpCQyxrQkFFeUIsR0FGSixLQUVJOztBQUNyQixhQUFLQyxLQUFMLEdBQWFMLElBQWI7QUFDQSxhQUFLTSxPQUFMLEdBQWVMLE1BQWY7QUFDSDs7Ozs7Ozs7Ozs7O3VDQWlCZ0IsS0FBS0QsSUFBTCxDQUFVTyxLQUFWLENBQWdCQyxLQUFoQixDQUFzQixLQUFLUixJQUEzQixROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBR1U7QUFBQSxnQkFBckJTLFFBQXFCLHVFQUFWLFNBQVU7O0FBQ3ZCLGdCQUFHLEtBQUtQLFNBQUwsS0FBbUJPLFFBQXRCLEVBQStCO0FBQzNCLHFCQUFLUCxTQUFMLEdBQWlCTyxRQUFqQjtBQUNBLHFCQUFLTixhQUFMLEdBQXFCLElBQXJCO0FBQ0g7QUFDRCxtQkFBTyxJQUFQO0FBQ0g7OzttQ0FDVU0sUSxFQUFTO0FBQ2hCLGlCQUFLVCxJQUFMLENBQVVVLEtBQVYsQ0FBZ0JDLEtBQWhCLENBQXNCRixRQUF0QjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7Ozs7a0RBQ2FHLEk7QUFBQUEsd0I7Ozs7Ozs7O3FDQUdQLEtBQUtULGE7Ozs7O0FBRUo7QUFDTVUsMEMsR0FBYSxLQUFLYixJQUFMLENBQVVVLEtBQVYsQ0FBZ0JJLEdBQWhCLENBQW9CLEtBQUtaLFNBQXpCLEM7O3FDQUNoQlcsVTs7Ozs7a0VBQ1FBLFU7Ozs7dUNBSVUsS0FBS04sS0FBTCxDQUFXLEtBQUtELE9BQWhCLEVBQXlCTSxJQUF6QixDOzs7QUFBZkcsc0M7O0FBQ04scUNBQUtmLElBQUwsQ0FBVVUsS0FBVixDQUFnQk0sR0FBaEIsQ0FBb0IsS0FBS2QsU0FBekIsRUFBb0NhLE1BQXBDO2tFQUNPQSxNOzs7O0FBR1gsb0NBQUcsS0FBS1gsa0JBQVIsRUFBMkI7QUFDdkIseUNBQUtKLElBQUwsQ0FBVVUsS0FBVixDQUFnQkMsS0FBaEIsQ0FBc0IsS0FBS1QsU0FBM0I7QUFDSDs7O3VDQUVZLEtBQUtLLEtBQUwsQ0FBVyxLQUFLRCxPQUFoQixFQUF5Qk0sSUFBekIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQWxEUDtBQUNOLG1CQUFPLEtBQUtQLEtBQVo7QUFDSDs7OzRCQUNhO0FBQ1YsbUJBQU8sS0FBS0gsU0FBWjtBQUNIOzs7NEJBQ2lCO0FBQ2QsbUJBQU8sS0FBS0MsYUFBWjtBQUNIOzs7NEJBQ3NCO0FBQ25CLG1CQUFPLEtBQUtDLGtCQUFaO0FBQ0g7Ozs7O2tCQXJCZ0JMLEs7O0FBZ0VyQmtCLE9BQU9DLE9BQVAsR0FBaUJuQixLQUFqQiIsImZpbGUiOiJRdWVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnl7XG4gICAgX2NhY2hlS2V5ID0gbnVsbDtcbiAgICBfY2FjaGVFbmFibGVkID0gZmFsc2U7XG4gICAgX2NhY2hlQ2xlYXJFbmFibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwb29sLCBzdHJpbmcpe1xuICAgICAgICB0aGlzLl9wb29sID0gcG9vbDtcbiAgICAgICAgdGhpcy5fc3RyaW5nID0gc3RyaW5nO1xuICAgIH1cblxuICAgIGdldCBwb29sKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb29sO1xuICAgIH1cbiAgICBnZXQgY2FjaGVLZXkoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlS2V5O1xuICAgIH1cbiAgICBnZXQgY2FjaGVFbmFibGVkKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZUVuYWJsZWQ7XG4gICAgfVxuICAgIGdldCBjYWNoZUNsZWFyRW5hYmxlZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVDbGVhckVuYWJsZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgcXVlcnkoKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3J1bm5pbmcgYSBxdWVyeScpO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wb29sLnF1ZXJ5LmFwcGx5KHRoaXMucG9vbCwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGNhY2hlKGNhY2hlS2V5ID0gJ2RlZmF1bHQnKXtcbiAgICAgICAgaWYodGhpcy5fY2FjaGVLZXkgIT09IGNhY2hlS2V5KXtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5ID0gY2FjaGVLZXk7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZUVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjbGVhckNhY2hlKGNhY2hlS2V5KXtcbiAgICAgICAgdGhpcy5wb29sLmNhY2hlLmNsZWFyKGNhY2hlS2V5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGFzeW5jIGV4ZWMoLi4uYXJncyl7XG5cbiAgICAgICAgLy8gaXMgY2FjaGluZyBlbmFibGU/XG4gICAgICAgIGlmKHRoaXMuX2NhY2hlRW5hYmxlZCl7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlJ3MgYW55dGhpbmcgaW4gdGhlIGNhY2hlIHVzZSBpdFxuICAgICAgICAgICAgY29uc3QgY2FjaGVkRGF0YSA9IHRoaXMucG9vbC5jYWNoZS5nZXQodGhpcy5fY2FjaGVLZXkpO1xuICAgICAgICAgICAgaWYoY2FjaGVkRGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZERhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzZXQgdGhlIGNhY2hlXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnF1ZXJ5KHRoaXMuX3N0cmluZywgYXJncyk7XG4gICAgICAgICAgICB0aGlzLnBvb2wuY2FjaGUuc2V0KHRoaXMuX2NhY2hlS2V5LCByZXN1bHQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuX2NhY2hlQ2xlYXJFbmFibGVkKXtcbiAgICAgICAgICAgIHRoaXMucG9vbC5jYWNoZS5jbGVhcih0aGlzLl9jYWNoZUtleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeSh0aGlzLl9zdHJpbmcsIGFyZ3MpO1xuICAgIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBRdWVyeTtcbiJdfQ==
