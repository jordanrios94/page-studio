(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['dustjs-linkedin', 'bluebird', 'lodash', 'jquery'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.Template = factory(root.dust, root.Promise, root._, root.jQuery);
    }
}(this, function(dust, Promise, _, $) {
    if(!dust || !dust.helpers) throw new Error('Dust.js is not available');
    if(!Promise) throw new Error('Bluebird.js is not available');
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');

    // A unique incrementing ID for use by the dust.js @apib helper below
    var appLoadingId = 0;

    dust.iter = function(chk, ctx, bodies, params) {
        var self = this;
        var obj = ctx.current();
        var keys = [];

        params = _.map(params || {}, function(param) {
          return dust.helpers.tap(param, chk, ctx);
        });

        for (var k in obj) {
            if(obj.hasOwnProperty(k)) keys.push(k);
        }
        if(params.sort){
            var by = params.by || 'name';
            keys = keys.sort(function(ka, kb) {
                var a = new String(obj[ka][by]).toLowerCase(), 
                    b = new String(obj[kb][by]).toLowerCase();
                if(a > b) return 1;
                if(a < b) return -1;
                return 0;
            })
        }
        var l = keys.length;
        for (var k in keys) {
            var key = keys[k];
            chk = chk.render(bodies.block, ctx.push({
                iter: arguments.callee,
                key: key,
                value: obj[key],
                index: k,
                length: l
            }));
        }
        return chk;
    };

    var uuids = {};
    _.extend(dust.helpers, {
      /**
       * {@ifAuthenticated}
       *    User is authenticated
       * {:else}
       *    User is anonymous
       * {/ifAuthenticated}
       */
      ifAuthenticated: function(chunk, context, bodies, params) {
        if(bodies.block) {
          return chunk.map(function(chunk) {
            FS.Auth.isLoggedIn()
              .then(
                function() {
                  chunk.render(bodies.block, context).end();
                },
                function() {
                  if(bodies['else']) {
                    chunk.render(bodies['else'], context).end();
                  }
                }
              );
          });
        }
          return chunk;
      },

      /**
       * {@ifHasRole role="Petitions Admin"}
       *    User has the Petitions Admin role
       * {:else}
       *    User does NOT have the Petitions Admin role
       * {/ifAuthenticated}
       */
      ifHasRole: function(chunk, context, bodies, params) {
        params = params || {};

        if(!params.role || !params.module || !params.product) {
          FS.RCL.warn('Did not specify role | module | product');
          return chunk;
        }

        if(bodies.block) {
          return chunk.map(function(chunk) {
            FS.SecurityManager.hasRole(params.product, params.module, params.role)
              .then(function() {
                chunk.render(bodies.block, context).end();
              })
              .caught(function(error) {
                if(bodies['else']) {
                  chunk.render(bodies['else'], context).end();
                }
              });

          });
        }
          return chunk;
      },

      /**
       * {@formUrl formID="sdfhksdfj" /}
       */
      formUrl: function(chunk, context, bodies, params) {
        params = params || {};
        
        var formID = params.formID,
            returnModule = params.returnModule,
            showMsg = params.showMsg,
            engine = params.engine || 'FS2',
            serviceName = params.oldFormName || params.oldProcessName || null;
            
        return chunk.map(function(chunk) {
          Promise.resolve(FS.Forms.getUrl(formID, params, engine, showMsg, returnModule, serviceName, null, null, params.returnUrls))
            .then(
              function(formUrl) {
                chunk.write(formUrl).end();
              },
              function() {
                chunk.write(params.failUrl || '#').end();
              }
            );
        });
      },
      
      /**
      * {@apib name="Account_CTAX" type="html"} {.|s} {:else} ERROR! {/apib}
      */
      apib: function(chunk, context, bodies, params, transform) {
        params = params || {};

        if(!params.name) {
          FS.RCL.warn('Must specify an API name');
          return chunk;
        }
        var api = params.name;
        delete params.name;

        var dataType = 'json';
        if(params.type) {
          dataType = params.type;
          delete params.type;
        }

        var cache = false;
        if(params.cache) {
          cache = params.cache;
          delete params.cache;
        }

        var loadingHtml = '<span class="muted">Loading&hellip;</span>';
        if(params.loadingText) {
          loadingHtml = dust.escapeHtml(params.loadingText);
          delete params.loadingText;
        } else if(params.loadingHtml) {
          loadingHtml = params.loadingHtml;
          delete params.loadingHtml;
        }

        if(bodies.block) {
          var id = ++appLoadingId, 
            placeholderContainer = $('<div><div data-fs-load="'+id+'">'+loadingHtml+'</div></div>'),
            onrender = function(data, block) {
              var locator = $('[data-fs-load="'+id+'"]'),
                output;

              if(!_.isFunction(bodies[block])) {
                FS.RCL.error('Trying to load non-existant block', block, bodies);
              } else {
                var localContext = context.push(data);
                // TODO: Seems like a hack. Probably is a hack. Shouldn't be a hack
                if(localContext && localContext.stack && localContext.stack.tail && localContext.stack.tail.head) {
                  _.extend(localContext.stack.head, localContext.stack.tail.head);
                }
                chunk.capture(bodies[block], localContext, function(output) {
                  setTimeout(function() { locator.html(output); }, 0);
                });
              }
            };
          
          FS.API.get(api, params, undefined, dataType)
            .then(
              function(data) {
                var outputContext = {};
                if(_.isFunction(transform)) {
                  outputContext.transformed = transform(data);
                  outputContext.raw = data;
                } else {
                  outputContext = data;
                }
                onrender(outputContext, 'block');
              }, 
              function(error) {
                onrender(error, 'error');
              }
            );
          return chunk.write(placeholderContainer.html());
        }
          return chunk;
      },

      /**
       * {@limData api="CapitaLIMTest"}
       *   {#transformed} ... {/transformed}
       * {/limData}
       */
      limData: function(chunk, context, bodies, params) {
        return dust.helpers.apib(chunk, context, bodies, params, function(input) {
          return _.map(input, function(row) {
            return _.object(
              _.flatten(_.map(row, _.keys)),
              _.flatten(_.map(row, _.values))
            );
          });
        });
      },

      /**
       * {@sort input="arrayOfObjects" by="id"}
       *    arrayOfObjects is sorted by ID here
       * {/sort}
       */
      sort: function(chunk, context, bodies, params) {
        params = params || {};
        if(!params.input || !_.isArray(params.input)) {
          FS.RCL.warn('Input parameter to @sort must be an array of objects.');
        }

        if(bodies.block) {
          var sortedOutput = params.input;
          if(params.by) {
            sortedOutput = sortObjects(sortedOutput, params.by, !!params.reverse);
          }
          chunk.render(bodies.block, context.push({sorted: sortedOutput}));
        }
        chunk.end();
        return chunk;
      },

      /**
       * {@objectKeys input=someObject}
       *    {key}: {value}<br />
       * {/objectKeys}
       */
      objectKeys: function(chunk, context, bodies, params) {
        params = params || {};
        if(!$.isPlainObject(params.input)) {
          FS.RCL.warn('Input parameter to @objectKeys must be a plain object');
        }

        var isEmpty = true;
        if(bodies.block) {
          for(var key in params.input) {
            isEmpty = false;
            var localContext = context.push({key: key, value: params.input[key]});
            // TODO: Seems like a hack. Probably is a hack. Shouldn't be a hack
            if(localContext && localContext.stack && localContext.stack.tail && localContext.stack.tail.head) {
              localContext = localContext.push(localContext.stack.tail.head);
            }
            chunk.render(bodies.block, localContext);
          }
        }
        if(isEmpty && bodies.empty) {
          chunk.render(bodies.empty, context);
        }
        return chunk;
      },

      /**
       * {@uuid /}
       * {@uuid id="formID" /}
       */
      uuid: function(chunk, context, bodies, params) {
        params = params || {};
        var ID = params.id,
          UUID;
        if(ID && uuids[ID]) {
          UUID = uuids[ID];
        }
        if(!UUID) {
          UUID = uuid();
          if(ID) {
            uuids[ID] = UUID;
          }
        }
        return chunk.write(UUID);
      },

      /**
       * {@regex pat="([0-9]+)" mod="g" src="asdfh342342jfks"}{matches[1]}{/regex}
       */
      regex: function(chunk, context, bodies, params) {
        params = params || {};
        if(!params.pat) {
          FS.RCL.warn('No pattern supplied to @regex');
        }
        if(!params.src) {
          FS.RCL.warn('No src supplied to @regex');
        }
        var regex = new RegExp(params.pat, params.mod || '');
        var localContext = context.push({matches: regex.exec(params.src)});
        chunk.render(bodies.block, localContext);
        return chunk;
      }
    });
    
    var TemplatePromise = function TemplatePromise() { 
        Promise.apply(this, arguments);
    };
    
    TemplatePromise.prototype = Object.create(Promise.prototype);
    TemplatePromise.prototype.constructor = TemplatePromise;
    
    TemplatePromise.prototype.set = function(method, selector) {
        return this
        .then(function(output) {
            return $(selector)[method](output);
        });
    };

    TemplatePromise.prototype.methods = {
        into: 'html',
        append: 'append',
        prepend: 'prepend',
        after: 'after',
        before: 'before',
        replace: 'replaceWith'
    };

    _.each(TemplatePromise.prototype.methods, function(jQueryMethod, templateMethod) {
        TemplatePromise.prototype[templateMethod] = function(selector) {
            return this.set(jQueryMethod, selector);
        };
    });

    var TemplateManager = function(dust) {
        this.dust = dust;
    };

    TemplateManager.prototype.has = function(name) {
        if(!name) throw new Error('No name supplied to FS.Template().has');
        return !!this.dust.cache[name];
    };

    TemplateManager.prototype.add = function(source, name) {
        if(!source) throw new Error('No source supplied to FS.Template().add');
        if(!name) throw new Error('No name supplied to FS.Template().add');
        return this.dust.loadSource(this.dust.compile(source, name));
    };

    var TemplateFactory = function(dust) {
        this.dust = dust;
        this.local = _.bind(this.local, this);
        this.server = _.bind(this.server, this);
        this._render = Promise.promisify(this.dust.render);

        return _.bind(this.render, this);
    };

    TemplateFactory.prototype.local = function(template, context) { 
        return this._render(template, context);
    };

    TemplateFactory.prototype.server = function(template, context) {
        if(!FS.API.appName.match(/(AchieveForms|AF-Renderer)/)) return this.local(template, context);
        
        return FS.API.post('CreateTemplate', { template: template }, context)
        .then(function(ret){
          if(ret.error) throw new Error(ret.error);
          return ret.html;
        }).caught(function(err){
          throw new Error(err.error || err);
        })
    };

    TemplateFactory.prototype.render = function(template, context, server) {
        if(!template) return new TemplateManager(this.dust);
        /*if(root.IE && root.IEVersion <= 7) server = true;*/

        var _this = this;
        return new TemplatePromise(function (resolve, reject) {
            return (server === true ? _this.server : _this.local)
                (template, context || {}).then(resolve, reject);
        });
    };

    var root = this;
    return new TemplateFactory(dust);
}));
