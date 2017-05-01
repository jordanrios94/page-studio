!function(a, b) {
    if ("function" == typeof define && define.amd) {
        define(["underscore", "backbone", "jquery", "api"], function(a, c, d, api) {
            return b(a, c, d, api)
        });
    } else if ("undefined" != typeof exports) {
        var c = require("underscore"), d = require("backbone"), e = require("jquery");
        module.exports = b(c, d, e)
    } else {
        b(a._, a.Backbone, a.jQuery)
    }
}(this, function(a, b, c, api) {
    "use strict";

    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };

    Backbone.sync = function(method, model, options) {
        var params = {};

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = _.result(model, 'url') || urlError();
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch' || method === 'delete')) {
            params.data = options.attrs || model.toJSON(options);
        }

        // Pass along `textStatus` and `errorThrown` from jQuery.
        var error = options.error;
        options.error = function(xhr, textStatus, errorThrown) {
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            if (error) {
                error.call(options.context, xhr, textStatus, errorThrown);
            }
        };

        // override the Backbone ajax function
        _.extend(params, options);
        var fs_api;

        // hack for service because backbone_sync collides with backbone_firmstep
        if (options.helpWidget) {
            if (options.newapi) {
                api.config.apiUrl = '/api/';
            } else {
                api.config.apiUrl = '/apibroker/';
            }
        }

        if (options.type === 'post') {
            method = 'create';
        }

        switch(method){
            case 'create':
            case 'update':
            case 'patch':
            case 'delete': fs_api = api.post(params.url, {}, params.data);break;
            case 'read': fs_api = api.get(params.url, params.data); break;
            case 'delete_hard': fs_api = api['delete'](params.url, {}, params.data);break;
        }

        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr = fs_api;

        xhr.then(function(response){
            // send {"status":"error","message":[]} response for backbone validation, otherwise it will pass on the UI
            if(response && response.status === 'error'){
                xhr.error = options.error(xhr, 'error', response.message);
            }
            else{
                xhr.success = options.success(response, 'success', xhr);
            }
        });
        model.trigger('request', model, xhr, options);
        return xhr;
    };

});