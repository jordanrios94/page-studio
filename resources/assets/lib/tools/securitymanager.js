(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.SecurityManager = factory(root._, root.Promise);
    }
}(this, function(_, Promise) {
    if(!_) throw new Error('Underscore.js is not available');
    if(!Promise) throw new Error('Bluebird.js is not available');
    if(!FS.Auth) throw new Error('FS.Auth is not available');
    if(!FS.API) throw new Error('FS.API is not available');

    /**
     * A constructor
     */
    var SecurityManager = function SecurityManager() {

        var storageKey = 'SelfApp-Permissions-';
        var apiUrl = '/permissions';

        function getPermissionsStorageKey(product) {
            return storageKey + product;
        }

        function getPermissionsFromStorage(product) {
            return window.getItem(getPermissionsStorageKey(product));
        }

        function setPermissionsToStorage(product, permissions) {
            window.setItem(getPermissionsStorageKey(product), permissions);
        }

        /**
        * @return array of roles for the product
        **/
        SecurityManager.prototype.getPermissions = function(product) {
            var checkParams = {
                type: 'checkproduct',
                product: product
            };
            var permissions = getPermissionsFromStorage(product);
            if (permissions) {
                return Promise.resolve(permissions);
            }
            return FS.API.get(apiUrl, checkParams)
            .then(function(result) {
                setPermissionsToStorage(checkParams.product, result);
                return result;
            });
        };

        /**
        * @return boolean value if getPermissions() contains filter
        **/
        SecurityManager.prototype.hasRole = function() {
            var params;
            if(arguments.length === 3) {
            // Underscore might throw an error using `arguments` here.
            // If so, use `_.toArray(arguments)` - because it isn't really an array.
                params = _.object(['product', 'module', 'role'], arguments);
            } else {
                params = arguments[0] || {};
            }
            if (!params.product || !params.module || !params.role) {
                return Promise.resolve(false);
            }
            params = _.extend(params, { allow_access: true });
            var searchObj = _.pick(params, 'product', 'module', 'role', 'allow_access');
            return this.getPermissions(searchObj.product)
            .then(function(result) {
                var permission = result.allow_access || _.findWhere(result.product_permission || result, searchObj);
                return !!permission || Promise.reject('You do not have permissions to access [product: ' + searchObj.product + ', module: ' + searchObj.module + ', role: ' + searchObj.role + ']');
            });
        };

        SecurityManager.prototype.clearCache = function() {
            _.each(sessionStorage, function(item, index){
                cacheValue = sessionStorage.key(index);
                if(cacheValue && cacheValue.indexOf('Permissions') >= 0) {
                    sessionStorage.removeItem(cacheValue);
                }
            });
        };

    };

    return new SecurityManager();
}));