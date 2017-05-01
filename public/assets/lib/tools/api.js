(function(){
  (function(root, factory){
    var _, dependencies;
    _ = root._ || require('lodash');
    dependencies = ['bluebird', 'oboe', 'lodash', 'jquery', './auth', './utils'];
    if (typeof define === 'function' && define.amd) {
      return define(dependencies, factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
      root.FS = root.FS || {};
      return root.FS.API = factory(root.Promise, root.oboe, root._, root.jQuery, root.FS.Auth, root.utils);
    }
  })(this, function(Promise, oboe, _, $, Auth, utils){
    var config, root, ref$, API;
    if (!Promise) {
      throw new Error('Bluebird.js is not available');
    }
    if (!oboe) {
      throw new Error('oboe.js is not available');
    }
    if (!_) {
      throw new Error('lodash.js is not available');
    }
    if (!$) {
      throw new Error('jquery.js is not available');
    }
    if (!Auth) {
      throw new Error('FS.Auth is not available');
    }
    if (!utils) {
      throw new Error('utils is not available');
    }
    config = this.config || utils.defaultConfig;
    root = this.window || this;
    Auth = ((ref$ = root.FS) != null ? ref$.Auth : void 8) || Auth;
    API = (function(){
      API.displayName = 'API';
      var prototype = API.prototype, constructor = API;
      function API(overrideConfig){
        var this$ = this instanceof ctor$ ? this : new ctor$;
        this$.config = _.defaults(overrideConfig || {}, config);
        this$.auth = Auth.withConfig(this$.config);
        this$.appName = null;
        this$.cacheObject = false;
        _.each(['get', 'delete', 'post', 'put', 'patch', 'postform'], function(method){
          return this[method] = function(name, query, data, expect){
            var transform;
            expect == null && (expect = 'json');
            transform = method === 'postform'
              ? $.param
              : JSON.stringify;
            return this.request(name, {
              query: query || {},
              method: method === 'postform' ? 'post' : method,
              data: transform(data)
            }, expect);
          };
        }, this$);
        return this$;
      } function ctor$(){} ctor$.prototype = prototype;
      prototype.toString = function(){
        return 'FS.API';
      };
      prototype.setAppName = function(name){
        return this.appName = name;
      };
      prototype.setCacheObject = function(cacheObject){
        return this.cacheObject = cacheObject;
      };
      prototype.apiUrl = function(api, query){
        var callAuth, useSlash, queryString, url, hasQuery;
        if (!_.isString(api)) {
          throw {
            name: 'MissingApiNameError',
            message: 'No API name supplied to FS.API.apiUrl'
          };
        }
        callAuth = query != null ? query.auth : void 8;
        useSlash = api.charAt(0) === '/';
        queryString = _.isObject(query) ? utils.makeQueryString(query) : query;
        if (!callAuth) {
          url = [this.config.apiUrl];
        } else {
          url = ['/'];
        }
        if (useSlash && !config.vhostsWorkaround) {
          url.push(this.config.apiUrl.slice(-1 === '/') ? api.slice(1) : api);
        }
        hasQuery = true;
        if (!useSlash) {
          url.push('?api=', api);
        } else if (config.vhostsWorkaround) {
          url.push('?path=', api.slice(1));
        } else {
          hasQuery = false;
        }
        if (queryString) {
          url.push(hasQuery ? '&' : '?', queryString);
          hasQuery = true;
        }
        if (this.appName) {
          url.push(hasQuery ? '&' : '?', 'app_name=', this.appName);
          hasQuery = true;
        }
        url.push(hasQuery ? '&' : '?', '_=', +new Date().getTime());
        return url.join('');
      };
      prototype.request = function(api, options, expect){
        var apiEndpointKey, url, method, cache, contentType, isJson, data, authKey, this$ = this;
        options == null && (options = {});
        expect == null && (expect = 'json');
        apiEndpointKey = api;
        if (deepEq$(apiEndpointKey.indexOf('/'), 0, '===')) {
          apiEndpointKey = apiEndpointKey.substring(1);
        }
        apiEndpointKey = apiEndpointKey.replace(/^([A-Z])|[\s-_/](\w)/g, function(found, p1, p2, offset){
          if (p2) {
            return p2.toUpperCase();
          }
          return p1.toLowerCase();
        });
        if (options.method === 'get' && this.cacheObject && this.cacheObject.has(apiEndpointKey)) {
          return this.cacheObject.get(apiEndpointKey);
        }
        url = this.apiUrl(api, options.query);
        method = options.method || 'GET';
        cache = !!(typeof options.cache === 'undefined' || options.cache);
        contentType = options.contentType || 'application/x-www-form-urlencoded';
        isJson = expect === 'json';
        data = isJson && this.config.streamingEnabled
          ? (contentType && (options.headers || (options.headers = {}), options.headers['Content-Type'] = contentType), {
            url: url,
            method: method,
            headers: options.headers,
            body: options.data,
            cache: cache
          })
          : {
            url: url,
            type: method,
            data: options.data,
            dataType: expect,
            headers: options.headers,
            contentType: options.contentType,
            cache: cache,
            processData: !(contentType && contentType !== '')
          };
        authKey = typeof root.getItem === 'function' ? root.getItem('authKey') : void 8;
        if (authKey) {
          data.url += '&sid=' + authKey;
          if (isJson && this.config.streamingEnabled) {
            return this.oboeify(oboe(data));
          } else {
            return this.oboeify($.ajax(data));
          }
        } else {
          return this.auth.hasSession().then(function(session){
            data.url += '&sid=' + session['auth-session'];
            if (isJson && this$.config.streamingEnabled) {
              return this$.oboeify(oboe(data));
            } else {
              return this$.oboeify($.ajax(data));
            }
          });
        }
      };
      prototype.withConfig = function(overrideConfig){
        return new API(overrideConfig);
      };
      prototype.oboeify = function(func){
        var oboe_promise;
        oboe_promise = new Promise(function(resolve, reject){
          return func.done(resolve).fail(reject);
        }).cancellable()['catch'](function(err){
          if (err.body !== '') {
            throw err;
          }
        });
        _.each(['node', 'path', 'on'], function(method){
          return oboe_promise[method] = function(){
            var args;
            args = arguments;
            oboe_promise.then(function(request){
              if (!_.isFunction(request[method])) {
                throw new Error(method + " is not implemented for this API type.");
              }
              return request[method].apply(request, args);
            });
            return oboe_promise;
          };
        });
        return oboe_promise;
      };
      return API;
    }());
    return new API();
  });
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) { 
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);
