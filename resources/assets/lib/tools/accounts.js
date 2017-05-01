(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'jquery', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.Accounts = factory(root._, root.jQuery, root.Promise);
    }
}(this, function(_, $, Promise) {
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');
    if(!Promise) throw new Error('Bluebird is not available');

    var Accounts = function(){
        var options = {};
        var $widgetElements = {};

        Accounts.prototype.initWidget = function (selector, type) {
            $widgetElements['$' + type + 'WidgetElement'] = $(selector);
            return FS.Auth.isLoggedIn()
            .bind(this)
            .then(type === 'list' ? _getAccountsConfig : _buildServiceWidgetUI)
            .caught(_clickOnLoginButton);
        };

        var _getAccountsConfig = function (session) {
            return FS.API.get('/self-accounts')
            .bind(this)
            .then(function (config) {
                if (config) {
                    $(config.services).each(function(i) {
                        if(!config.services[i].error){
                            var ajaxURL = false;
                            switch(config.services[i].api){
                                case "Account_CTAX_Summary":
                                    ajaxURL = "/appshost/firmstep/self/accountdetails/phpscripts/counciltaxsummary.php";
                                    break;
                                case "Account_Benefits_Summary":
                                    ajaxURL = "/appshost/firmstep/self/accountdetails/phpscripts/benefitsummary.php";
                                    break;
                            }
                            if(ajaxURL){
                                $.ajax({
                                    async: false,
                                    url: ajaxURL
                                }).done(function(result) {
                                    config.services[i].data = result;
                                });
                            }
                        }
                    })
                    options = $.extend(options, config);   
                }
            })
            .lastly(_buildListWidgetUI);
        };

        var _buildListWidgetUI = function () {
            return Router()
            .getTitleOf({
                type: 'app',
                target: 'MyAccounts'
            })
            .bind(this)
            .then(function(moduleTitle) {
                return FS.Template('accounts_list', { moduleTitle: moduleTitle })
                .into($widgetElements.$listWidgetElement);
            })
            .bind(this)
            .then(_checkSelfID)
            .then(_renderServiceList)
            .caught(_displayNotice);
        };

        var _checkSelfID = _.once(function() { 
            return FS.API.get('self-checkcontact')
            .then(function(contact) {
              return contact && contact.references && _.findWhere(contact.references, {type: 'Self User ID'})
                || Promise.reject('User does not have a profile.');
            });
        });

        var _signupLinkGet = _.once(function() {
            return FS.SiteSettings.get(['SignupFormId', 'SignupFormText', 'SignupFormIcon', 'SignupFormEngine'])
        });
        
        var _buildServiceWidgetUI = function(){
            return _checkSelfID()
            .bind(this)
            .then(_renderSignUpButton);
        };

        var _renderSignUpButton = function(){
            var signupContainer = $('.services_signup_link', $widgetElements.$serviceWidgetElement);

            return _signupLinkGet()
            .then(function (signupLink) {
                return FS.Template('services_signup_link', signupLink).into(signupContainer);
            });
        };

        var _clickOnLoginButton = function(){
          $('#loginLink').click();
        };

       var _showError = function(error, service, container, innerSelector, containerSelector){
            var alertOptions = {
                alertClass: 'danger',
                alertBody: '<strong>Oh no!</strong> An error occurred while getting your ' + service.label + ' data',
                noClose: true
            };
                    
            var tasks = [
              FS.Template('services_list_badge', {error: true}).into(containerSelector + ' .loading'),
              FS.Template('alert', alertOptions).into(container.find(innerSelector))
            ];

            return Promise.all(tasks)
            .then(function() {
              container.find(containerSelector)
                .removeClass('panel-info')
                .addClass('panel-danger');
            });
        };

        var _displayNotice = function(){
            return FS.Auth.isLoggedIn().get('is_authenticated')
            .then(function(authVal){ 
                var template = (authVal) ? 'accounts_no_self' : 'accounts_not_loggedin';
                return FS.Template(template, {})
                .into($widgetElements.$listWidgetElement.find('#service_list_container'))
                .then(function($el) {
                  $el.find('#editProfile').click(function(event) {
                    event.preventDefault();
                    $('#editProfileLink').click();
                  });
                });
            })
        };

        var _renderServiceList = function(){
          var container = $('#service_list_container', $widgetElements.$listWidgetElement),
              services = options.services;

          container.html('');

          _.map(services, _.partial(_.bind(_initService, this), container));
        };

        var _initService = function(container, service){
          service.output = false;
          service.loading = true;
          var containerSelector = '#' + service.api + '_container';

           // Don't re-render existing services
            if ($(containerSelector).length) return false;

            return FS.Template('services_list', service)
            .append(container)
            .bind(this)
            .then(function (output) {
                return _loadService(service, container, containerSelector)
            });
        };

        var _loadService = function(service, container, containerSelector){
            var innerSelector = '#' + service.api + '_inner',
                loadingSpinner = smallspinner(container.find('.loading'), true);

            if (service.error) {
              return _showError(service.error_message, service, container, innerSelector, containerSelector);
            }
            // check the service.data attribute if present two times or one time
            return _renderService(service.data, service, container, innerSelector,containerSelector);
        };

        var _clickOnFormLink = function(e){
            var params = $(this).data(),
                formID = params && params.formId;

            e.preventDefault();
            FS.Forms.render(formID, params);
        };

        var _clickOnPageLink = function(e){
            var pageToLoad = $(this).data(),
                router = new Router();

            e.preventDefault();

            router.getRoutes()
                .bind(router)
                .then(router.loadPage)
                .then(function(loadPage) {
                    new Router().loadPageByProps({
                        type: 'app',
                        target: pageToLoad.app,
                        page: pageToLoad.page,
                        arg: pageToLoad.arg
                    });
                });
        };

        var _renderService = function(output, service, container, innerSelector, containerSelector){
            var inner = container.find(innerSelector)
                .html(output)
                .on('click', 'a[data-form-name], a[data-form-id], a[data-form-ref]', _clickOnFormLink)
                .on('click', 'a[data-page], a[data-app]', _clickOnPageLink),
                badgeOptions = {
                    service: service,
                    accountNo: inner.find('.account-id :not(.label)').text()
                };

            return FS.Template('services_list_badge', badgeOptions).into(containerSelector + ' .loading');
        };
    };  

    return new Accounts();
}));