(function(){
  var replace$ = ''.replace;
  (function(root, factory){
    var _, dependencies;
    _ = root._ || require('lodash');
    dependencies = ['lodash', 'jquery', 'bluebird', 'AF'];
    if (typeof define === 'function' && define.amd) {
      return define(dependencies, factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
      root.FS || (root.FS = {});
      return root.FS.AchieveForms = factory(root._, root.jQuery, root.Promise);
    }
  })(this, function(_, $, Promise, AF){
    var loadGoogleApi, AchieveForms;
    if (!_) {
      throw new Error('Underscore/Lodash not available');
    }
    if (!$) {
      throw new Error('jQuery is not available');
    }
    if (!Promise) {
      throw new Error('Bluebird is not available');
    }
    loadGoogleApi = function(api, version, params){
      params == null && (params = {});
      return new Promise(function(resolve){
        params.callback = resolve;
        return google.load(api, version, params);
      });
    };
    AchieveForms = (function(){
      AchieveForms.displayName = 'AchieveForms';
      var prototype = AchieveForms.prototype, constructor = AchieveForms;
      function AchieveForms(){
        this.ready = this.preload();
      }
      prototype.preload = _.once(function(){
        return Promise.all([]).bind(this).then(function(){
          var ref$;
          window.AF || (window.AF = {});
          (ref$ = window.AF)._iframe || (ref$._iframe = {});
          this.frameSettings = window.AF._iframe;
          (ref$ = this.frameSettings).forms || (ref$.forms = {});
          return (ref$ = this.frameSettings).getData || (ref$.getData = function(it){
            if (it) {
              return this.forms[it];
            } else {
              return _.first(_.values(this.forms));
            }
          });
        });
      });
      prototype.load = function(params, uuid){
        uuid == null && (uuid = window.uuid());
        if (typeof params !== 'object') {
          throw new Error("No parameters supplied to AchieveForms");
        }
        if (!params.db_id) {
          if (!(params.mode === "view" && (params.submissionid || params.task_id))) {
            if (!(params.form_uri || params.form_definition || params.submissionid)) {
              throw new Error("No form supplied to AchieveForms");
            }
          }
        }
        if (params.form_uri && params.form_definition) {
          throw new Error("Invalid parameters supplied to AchieveForms");
        }
        _.each(params, function(val, key){
          if (_.isString(val)) {
            return params[key] = decodeURIComponent(val);
          }
        });
        return this.ready.bind(this).then(function(){
          return this.calculateParams(params);
        }).then(function(it){
          return this.render(uuid, params.ret, it);
        }).then(function(){
          return this.authModalPrompt(params);
        });
      };
      prototype.calculateParams = function(input){
        var params, that;
        params = {
          product: "Self",
          local: input.form_definition != null,
          mode: input.mode === 'fill' ? 'render' : 'view',
          form_uri: input.form_uri || input.form_definition
        };
        input.onRender = this.onRender();
        if (input.submissionid) {
          params.submissionid = input.submissionid;
        }
        if (input.process_uri) {
          params.process_uri = input.process_uri;
        }
        if (input.process_id) {
          params.process_id = input.process_id;
        }
        if (input.task_id) {
          params.task_id = input.task_id;
        }
        if (input.case_id) {
          params.case_id = input.case_id;
        }
        if (input.redirectlink) {
          params.redirectlink = decodeURIComponent(input.redirectlink);
        }
        if (input.cancelRedirectLink) {
          params.cancelRedirectLink = input.cancelRedirectLink;
        }
        if (input.db_id) {
          params.db_id = input.db_id;
        }
        if (input.stage_name) {
          params.stage_name = input.stage_name;
        }
        if (that = input.default_tokens) {
          params.default_tokens = that;
        }
        if (that = input.callbacks) {
          params.callbacks = that;
        }
        if (input.NewAFProfileForm) {
          params.submit = false;
        }
        params.process = input.process;
        params.isPublished = input.isPublished;
        return FS.Auth.isLoggedIn().then(function(Auth){
          var isAuth, apis;
          isAuth = Auth.is_authenticated;
          apis = [];
          if (isAuth) {
            apis[0] = FS.Profile.get();
            apis[1] = FS.API.get('self-getxref');
            apis[2] = FS.Profile.getPrimaryEmail();
          } else {
            apis[0] = {};
            apis[1] = {};
            apis[2] = {};
          }
          apis[3] = FS.SiteSettings.get(['CustomIFrameCss', 'DashSite']);
          apis[4] = FS.API.get('getCiviVars').caught(function(){});
          apis[5] = !_.isEmpty(FS.Auth.session)
            ? FS.Auth.session
            : FS.API.auth.session;
          return Promise.all(apis).spread(function(profile, xrefs, emailDetails, siteSettings, civiVars, session){
            var account_xrefs, ref$, i$, own$ = {}.hasOwnProperty;
            if (session.is_authenticated) {
              if (!profile) {
                profile = {};
              }
              params.default_tokens = profile;
              account_xrefs = {};
              _.each(xrefs.references, function(item){
                var xref_name;
                xref_name = 'xref_' + item.type.replace(/\s/g, '_').toLowerCase();
                return account_xrefs[xref_name] = item.reference;
              });
              _.extend(params.default_tokens, account_xrefs);
              _.extend(params.default_tokens, profile.account);
              _.extend(params.default_tokens, (ref$ = profile.address) != null ? ref$[profile != null ? profile.address_id : void 8] : void 8) || {};
              _.extend(params.default_tokens, (ref$ = profile.email) != null ? ref$[profile != null ? profile.email_id : void 8] : void 8) || {};
              _.each(profile.phone, function(item, index){
                var ref$;
                if ((ref$ = item.phone_type_id) === "1" || ref$ === 1) {
                  params.default_tokens.Phone_Number = item.phone;
                  params.default_tokens.phone1 = item.phone;
                }
                if ((ref$ = item.phone_type_id) === "2" || ref$ === 2) {
                  params.default_tokens.Mobile_Number = item.phone;
                  params.default_tokens.phone2 = item.phone;
                }
                if ((ref$ = item.phone_type_id) === "3" || ref$ === 3) {
                  params.default_tokens.Alternative_Number = item.phone;
                  return params.default_tokens.phone3 = item.phone;
                }
              });
              _.extend(params.default_tokens, (ref$ = profile.phone) != null ? ref$[profile != null ? profile.phone_id : void 8] : void 8) || {};
              _.extend(params.default_tokens, profile.details);
              params.default_tokens.address_start_date = params.default_tokens.start_date_;
              params.default_tokens.address_end_date = params.default_tokens.end_date_;
              params.default_tokens.Date_of_Birth = params.default_tokens.birth_date;
              params.default_tokens.Email_Address = params.default_tokens.email || emailDetails;
              params.default_tokens.phone_number = params.default_tokens.phone;
              params.default_tokens.First_Name = params.default_tokens.first_name;
              params.default_tokens.Surname = params.default_tokens.last_name;
              params.default_tokens.UCRN = params.default_tokens.ucrn;
              params.default_tokens.uprn = params.default_tokens.uprn;
              params.default_tokens.Preferred_Contact_Method = params.default_tokens.preferred_contact_method;
              if (profile.consent_to_share_ === "0") {
                params.default_tokens.AllowSharingAcrossOrganisation = 'No';
              } else {
                params.default_tokens.AllowSharingAcrossOrganisation = 'Yes';
              }
              if (profile.gender_id === 2 || profile.gender_id === "2") {
                params.default_tokens.gender_id = 'Male';
              } else if (profile.gender_id === 1 || profile.gender_id === "1") {
                params.default_tokens.gender_id = 'Female';
              } else {
                params.default_tokens.gender_id = null;
              }
              params.default_tokens.preferred_contact_method_id = params.default_tokens.preferred_contact_method;
              if (params.default_tokens.preferred_contact_method === 1 || params.default_tokens.preferred_contact_method === "1") {
                params.default_tokens.preferred_contact_method = "Phone";
              }
              if (params.default_tokens.preferred_contact_method === 2 || params.default_tokens.preferred_contact_method === "2") {
                params.default_tokens.preferred_contact_method = "Phone 2";
              }
              if (params.default_tokens.preferred_contact_method === 3 || params.default_tokens.preferred_contact_method === "3") {
                params.default_tokens.preferred_contact_method = "Email";
              }
              if (params.default_tokens.preferred_contact_method === 4 || params.default_tokens.preferred_contact_method === "4") {
                params.default_tokens.preferred_contact_method = "Post";
              }
              params.default_tokens.Title = "";
              if (civiVars) {
                for (i$ in ref$ = civiVars.titles) if (own$.call(ref$, i$)) {
                  (fn$.call(this, ref$[i$]));
                }
              } else {
                console.log("civiVars is not set");
              }
              params.user_email = emailDetails;
            }
            if (siteSettings.CustomIFrameCss) {
              params.custom_css = (replace$.call(siteSettings.CustomIFrameCss, ' ', '')).split(',');
            }
            if (session) {
              params.session = session;
            }
            if (siteSettings.DashSite) {
              params.product = "Dash";
            }
            return params;
            function fn$(v){
              if (v.value === params.default_tokens.prefix_id) {
                params.default_tokens.Title = v.name;
              }
            }
          });
        });
      };
      prototype.onRender = function(){};
      prototype.authModalPrompt = function(params){
        var apiPath, apiParams;
        if (params.db_id) {
          apiPath = '/task';
          apiParams = {
            action: "get_by_id",
            id: params.db_id
          };
        } else {
          apiPath = '/';
          apiParams = {
            api: "GetDocument",
            uri: params.form_uri
          };
        }
        return FS.API.get(apiPath, apiParams).then(function(formData){
          var category;
          if (params.db_id) {
            category = formData.category;
          } else {
            category = _.result(_.find(formData.metadata, {
              'Name': 'category'
            }), 'Value');
          }
          return FS.API.get('/selfPublishedCategory', {
            category: category
          });
        }).then(function(config){
          return createAccountModalPrompt({
            noClose: config.auth_required,
            goBack: config.auth_required,
            skipModal: config.skip_modal || false
          });
        });
      };
      prototype.render = function(uuid, ret, params){
        var frameId, $container, $loading, $form;
        frameId = encodeURIComponent("fillform-frame-" + uuid);
        this.frameSettings.forms[frameId] = _.extend({}, {
          data: params
        });
        $container = $("#form-instance-" + uuid);
        if (!$container.length) {
          throw new Error("No container available for AchieveForms");
        }
        $loading = $container.find('.loading').hide();
        $form = $container.find('.renderForm');
        if (!$form.length) {
          $form = $('<div/>', {
            'class': 'renderForm'
          }).appendTo($container);
        }
        return $('<iframe/>', {
          id: frameId,
          'class': "achieveforms-iframe",
          border: 0,
          frameBorder: 0,
          scrolling: 'no',
          src: "/fillform/?iframe_id=" + frameId
        }).appendTo($form).focus();
      };
      prototype.showNewAFContainer = function(){
        return $('.achieveforms-iframe').removeClass('hide');
      };
      prototype.hideNewAFContainer = function(){
        return $('.achieveforms-iframe').addClass('hide');
      };
      return AchieveForms;
    }());
    return new AchieveForms();
  });
}).call(this);
