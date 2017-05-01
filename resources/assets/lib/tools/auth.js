(function(){
  (function(root, factory){
    var _, dependencies;
    _ = root._ || require('lodash');
    dependencies = ['bluebird', 'oboe', 'lodash', 'jquery', './utils'];
    if (typeof define === 'function' && define.amd) {
      return define(dependencies, factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
      root.FS || (root.FS = {});
      return root.FS.Auth = factory(root.Promise, root.oboe, root._, root.jQuery, root.utils);
    }
  })(this, function(Promise, oboe, _, $, utils){
    var config, root, Auth;
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
    if (!utils) {
      throw new Error('utils is not available');
    }
    config = this.config || utils.defaultConfig;
    root = this.window || this;
    Auth = (function(){
      Auth.displayName = 'Auth';
      var prototype = Auth.prototype, constructor = Auth;
      function Auth(overrideConfig){
        this.config = _.extend(config, overrideConfig);
        this.apiUrlRoot = this.config.authApiUrl.replace(/\/isauthenticated$/i, '/');
        this.session = {};
      }
      prototype.toString = function(){
        return 'FS.Auth';
      };
      prototype.withConfig = function(overrideConfig){
        return new Auth(overrideConfig);
      };
      prototype.apiUrl = function(api, returnUrl, params){
        var query, ref$;
        returnUrl = encodeURIComponent(returnUrl);
        if (api == null) {
          throw new Error('API not specified for FS.Auth.apiUrl');
        }
        query = _.extend({
          uri: returnUrl || this.config.returnUrl || root.location && root.location.href.replace(/\/[^\/]*$/, '/'),
          hostname: encodeURIComponent(this.config.hostname || ((ref$ = root.location) != null ? ref$.hostname : void 8))
        }, params || {});
        if (!query.uri) {
          throw new Error('Return URL not specified for FS.Auth.apiUrl');
        }
        if (!query.hostname) {
          throw new Error('Hostname not specified for FS.Auth.apiUrl');
        }
        return [this.apiUrlRoot, api, '?', utils.makeQueryString(query)].join('');
      };
      prototype.apiCall = function(){
        var apiArgs, task;
        apiArgs = arguments;
        task = Promise.defer();
        if (!this.config.streamingEnabled) {
          $.ajax({
            dataType: 'json',
            url: this.apiUrl.apply(this, apiArgs),
            data: {
              withCredentials: true
            },
            success: function(response){
              return task.resolve(response);
            }
          });
        } else {
          oboe({
            url: this.apiUrl.apply(this, apiArgs),
            data: 'json',
            xhrFields: {
              withCredentials: true
            }
          }).done(_.bind(task.resolve, task)).fail(_.bind(task.reject, task));
        }
        return task.promise;
      };
      prototype._getWidgetSession = _.memoize(function(widgetKey){
        return Promise.attempt(function(){
          var widgetKey;
          widgetKey = JSON.parse(root.getItem(widgetKey));
          if (!widgetKey) {
            throw new Error('Widget Key is not exist');
          } else {
            return widgetKey;
          }
        }).bind(this).caught(function(){
          return this.apiCall('iswidgetauthenticated', '', {
            widgetkey: widgetKey
          }).then(function(session){
            if (session.is_authenticated) {
              root.setItem(widgetKey, JSON.stringify(session));
            }
            return session;
          });
        });
      });
      prototype.getWidgetSession = function(widgetKey){
        return this._getWidgetSession(widgetKey).bind(this).then(function(session){
          var this$ = this;
          if (!session['auth-session']) {
            throw {
              name: 'InvalidSessionError',
              message: 'No session ID was supplied by the Auth API'
            };
          }
          if (!session.is_authenticated) {
            return this._loginWidget(session['auth-session'], widgetKey).bind(this).then(function(data){
              if (data.is_authenticated) {
                return this$._getWidgetSession(widgetKey);
              }
            });
          } else {
            return session;
          }
        });
      };
      prototype._loginWidget = function(authSession, widgetKey){
        return this.apiCall('widgetauth', '', {
          provider: 'ssauth',
          widgetkey: widgetKey,
          auth_session: authSession
        });
      };
      prototype._getSession = _.memoize(function(returnUrl, appName){
        var this$ = this;
        returnUrl || (returnUrl = (self === top
          ? window
          : window.top).location.href);
        if (returnUrl.match(/profileForm/g)) {
          returnUrl = window.top.location.origin;
        }
        return this.apiCall('isauthenticated', returnUrl, appName
          ? {
            appName: appName
          }
          : {}).then(function(data){
          if (data.Error) {
            throw new Error(data.Error);
          }
          data || (data = {});
          this$.session = data;
          if (typeof root.setItem === 'function') {
            root.setItem('authKey', this$.session['auth-session']);
          }
          return data;
        }).caught(function(e){
          if (e instanceof Error) {
            throw e;
          }
          e = new Error('Authentication Error');
          e.name = 'IsAuthenticatedError';
          throw e;
        });
      }, function(returnUrl){
        return returnUrl || '<empty>';
      });
      prototype.hasSession = function(location, appName){
        return this._getSession(location, appName).then(function(session){
          var e;
          if (session) {
            return session;
          }
          e = new Error('No session ID was supplied by the Auth API');
          e.name = 'InvalidSessionError';
          throw e;
        });
      };
      prototype.setSession = function(session_data){
        session_data == null && (session_data = null);
        if (!session_data) {
          return false;
        }
        this.session = session_data;
        if (typeof root.setItem === 'function') {
          root.setItem('authKey', this.session['auth-session']);
        }
        return session_data;
      };
      prototype.isLoggedIn = function(location){
        return this.hasSession(location).then(function(session){
          var e;
          if (session) {
            return session;
          }
          e = new Error('User not authenticated');
          e.name = 'NotAuthenticatedError';
          throw e;
        });
      };
      prototype.logout = function(uri){
        var ref$, ref1$, this$ = this;
        uri == null && (uri = null);
        return (((ref$ = root.FS) != null ? (ref1$ = ref$.Auth) != null ? typeof ref1$.isLoggedIn === 'function' ? ref1$.isLoggedIn(window.location.href) : void 8 : void 8 : void 8) || this.isLoggedIn(window.location.href)).then(function(session){
          var e, redirectUrl;
          if (!(root.location && session.logout)) {
            e = new Error('Cannot logout when not in a browser session');
            e.name = 'NotInBrowserError';
            throw e;
          }
          if (root.localStorage) {
            root.localStorage.clear();
          }
          if (root.sessionStorage) {
            root.sessionStorage.clear();
          }
          if (uri) {
            redirectUrl = "?uri=" + uri;
          } else {
            redirectUrl = "?uri=//" + root.location.hostname;
          }
          return root.location.href = session.logout + redirectUrl;
        }).caught(function(error){
          if ((error != null ? error.name : void 8) !== 'NotAuthenticatedError') {
            throw error;
          }
          return false;
        });
      };
      prototype.getRoles = function(){
        var ref$, ref1$;
        return (((ref$ = root.FS) != null ? (ref1$ = ref$.Auth) != null ? typeof ref1$.isLoggedIn === 'function' ? ref1$.isLoggedIn() : void 8 : void 8 : void 8) || this.isLoggedIn()).then(function(){
          var API, ref$;
          API = ((ref$ = root.FS) != null ? ref$.API : void 8) || require('./api');
          return API.get('GetUserRoles');
        }).then(function(roles){
          return _.map(roles, function(props){
            var keys;
            keys = _.flatten(_.map(props, _.keys));
            return _.object(keys, _.map(keys, function(key, i){
              return props[i][key];
            }));
          });
        }).caught(function(error){
          if ((error != null ? error.name : void 8) !== 'NotAuthenticatedError') {
            throw error;
          }
          return [];
        });
      };
      prototype.getProviders = function(){
        var task;
        task = Promise.defer();
        if (!this.config.streamingEnabled) {
          $.ajax({
            dataType: 'json',
            url: window.location.protocol + "//" + window.location.host + "/authapi/getproviders",
            data: {
              withCredentials: true
            },
            success: function(response){
              return task.resolve(response);
            }
          });
        } else {
          oboe({
            url: window.location.protocol + "//" + window.location.host + "/authapi/getproviders",
            data: 'json',
            xhrFields: {
              withCredentials: true
            }
          }).done(_.bind(task.resolve, task)).fail(_.bind(task.reject, task));
        }
        return task.promise;
      };
      prototype.register = function(){
        return undefined;
      };
      prototype.login = function(){
        return undefined;
      };
      prototype.changePassword = function(oldPass, newPass){
        var params, this$ = this;
        params = {
          uri: null,
          hostname: window.location.hostname,
          oldpass: oldPass,
          newpass: newPass,
          provider: 'ssauth',
          withCredentials: true
        };
        return this.isLoggedIn().then(function(){
          return $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/authapi/changepass',
            data: params,
            async: false,
            success: function(response){
              return response;
            }
          });
        }).then(function(response){
          var task, ref$;
          task = Promise.defer();
          if ((response != null ? response.changepass : void 8) == null) {
            task.reject('Invalid response from password change API');
          } else if (response.changepass.error != null) {
            task.reject(response.changepass.error);
          } else if (((ref$ = response.changepass) != null ? ref$.uid : void 8) == null) {
            task.reject('No UID returned by change pass API');
          } else {
            task.resolve(response.changepass);
          }
          return task.promise;
        });
      };
      prototype.changeEmail = function(newEmail, currentPass){
        var params, this$ = this;
        params = {
          newEmail: newEmail,
          pass: currentPass,
          provider: FS.Auth.session.auth_name
        };
        return this.isLoggedIn().then(function(){
          return this$.apiCall('changemail', null, params);
        }).get('changemail').then(function(it){
          var error, msg, that, ref$, router;
          error = it.error;
          if (error) {
            msg = error.match(/already taken/)
              ? 'The email address you have chosen is already in use by another account'
              : "Could not change your email: " + error;
            throw new Error(msg);
          }
          if ((that = (ref$ = this$.session) != null ? ref$.user : void 8) != null) {
            that.email = newEmail;
            that.name = newEmail;
          }
          router = new Router();
          router.dropParam('changeEmail');
          router.pushParamToUrl([{
            param: "changeEmail",
            value: newEmail
          }]);
          return newEmail;
        });
      };
      return Auth;
    }());
    return new Auth();
  });
}).call(this);
