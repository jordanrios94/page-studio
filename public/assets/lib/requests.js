
(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'jquery', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.Requests = factory(root._, root.jQuery, root.Promise);
    }
}(this, function(_, $, Promise) {
    if (!_) throw new Error('Underscore.js is not available');
    if (!$) throw new Error('jQuery.js is not available');
    if (!Promise) throw new Error('Bluebird is not available');

    var Requests = function() {
        this.init = function(options) {
            options = options || {};
            
            this.options = options;
            return _getTasks.call(this, options);
        };

        var _getTasks = function(options) {
            var transformFn;
            var isDashboard = false;

            switch(options.type) {
                case 'admin': isDashboard = true; transformFn = get_dashboard_admin_tasks; break;
                case 'user': isDashboard = true; transformFn = get_dashboard_user_tasks; break;
                default: transformFn = get_userTasks; break;
            }

            return FS.Auth.hasSession()
            .bind(this)
            .then(function(session){
                var user_id = (session && session.user && session.user.email) ? session.user.email : null;
                return Promise.all([transformFn(user_id, options.search || ""), _getForms()]);
            })
            .spread(function(tasks, forms){
                return _addFormIdToTasks(tasks, forms, isDashboard);
            });
        };

        var _addFormIdToTasks = function(tasks, forms, isDashboard){
            _.each(tasks, function(task){
                var form = _.find(forms, function(fm){
                    return (task.process_name === fm.formName) || (task.form_name === fm.formName);
                });
                if (form) task.blackListId = form.formId || form.processId;
            });

            return _updateTasks(tasks, isDashboard);
        }

        var get_dashboard_admin_tasks = function(user_id, search) {
            return Promise.all([
                FS.API.get('ListLegacyAdmin', {
                    limit: 50
                }),
                FS.API.get('/listTasksForUserAndGroups', {
                    limit:50,
                    published: 1,
                    task_status: 0,
                    assigned_user_id: user_id,
                    summaryString: 1,
                    search: search,
                    order:'task.date_started DESC'
                })
            ]).spread(_.partial($.extend, {}));
        };
        var get_dashboard_user_tasks = function(user_id, search) {
            return _getSiteSettings('LimitAncientDashboardTasks').then(function(limit){
                return FS.API.get('/dashboardTasks', {
                    limit: (limit ? limit : 50),
                    published: 1,
                    task_status: 1,
                    assigned_user_id: user_id,
                    summaryString: 1,
                    search: search,
                    order:'task.date_started DESC'
                });
            });
        };

        var get_userTasks = function(user_id) {
            var taskConfig =  {
                published: 1,
                task_status: 1,
                assigned_user_id: user_id,
                IncludeComplete: 1,
                'user-id': user_id
            };

            return _getSiteSettings('LimitTasks').then(function(limitdate){
                if(limitdate) taskConfig.limitdate = limitdate;
                return FS.API.get('/tasks', taskConfig);
            });
            
        };

        var _getSiteSettings = function(value){
            return FS.SiteSettings
            .get(value)
            .get(value)
            .then(function(config){
                return config;
            });
        };

        var _getSubmissionData = function(submission) {
            return {
                type: 'submission',
                reference: submission.id,
                date_started: submission.created,
                form_name: submission.formName,
                uri: submission.publishFormUri,
                submission_uri: submission.name,
                form_uri: submission.formUri,
                canView: true,
                forms_engine: submission.forms_engine,
                stageName: submission.stageName
            };
        };

        var _getCaseData = function(task) {
            return {
                type: 'case',
                uri: task.id,
                db_id: task.db_id,
                canView: false,
                canContinue: true,
                case_id: task.case_id,
                task_id: task.task_id,
                status: task.stage_name,
                stage_id: task.stage_id,
                stage_name: task.stage_name,
                reference: task.case_id,
                process_id: task.process_id,
                process_name: task.process_name,
                date_started: task.date_started,
                summary: task.summary
            };
        };

        var _getForms = function() {
            return FS.Forms.getAll()
        }

        var _updateTasks = function(items, isDashboard) {
            _.each(items, function(item, index) {
                var blackListId = item.blackListId;
                if (item.type == 'task') {
                    item.canContinue = true;
                } else if (!item.type && isDashboard){
                    item.canView = true;
                } else if( item.type == 'form' || item.type == 'process' ){
                    item.canView = true;
                } else if (item.type == 'case') {
                    item = items[index] = _getCaseData(item);
                } else if (item.type === 'submission') {
                    item = items[index] = _getSubmissionData(getDocApiTransformObject(item));
                }

                // Transform new AF data specifically 
                if(item.forms_engine === "R4"){
                    // Set reference 
                    if (!item.reference) {
                       item.reference = item.case_id || item.task_id;
                    }
                }

                var date = item.date_started || item.date_created,
                    basicFormat,
                    sortDateFormat;
                if (!date) return;

                if(this.options){ 
                    basicFormat = "DD-MM-YYYY HH:mm";
                }
                sortDateFormat = "YYYY-MM-DD HH:mm";

                /* This transformed date is used in the FS-Apps/firmstep/self/myrequests/templates/task_list.dust.html 
                   template for the start date  */
                item.transformed_date = prettifyFS2Date(date, null, "DD/MM/YYYY HH:mm");

                if(item.task_due) item.task_due = prettifyFS2Date(item.task_due, "standardDate", basicFormat);

                if(item.case_date_due) item.thread_due = prettifyFS2Date(item.case_date_due, "standardDate", basicFormat);

                if (item.date_started) {
                    item.date_started = prettifyFS2Date(date, "standardDate", basicFormat);
                } else {
                    item.date_created = prettifyFS2Date(date, "standardDate", basicFormat);
                }

                item.sort_date = prettifyFS2Date(date, "standardDate", sortDateFormat);

                if (item.type === 'process' && !item.complete && item.status === "Saved") {
                    item.canView = false;
                }
                
                if(item.canView) {
                    item.sort_date = item.sort_date;
                    item.sort_value = '0' + item.sort_date;
                    item.task_type = 'viewable';
                }else {
                    item.sort_date = item.sort_date;
                    item.sort_value = '1' + item.sort_date;
                    item.task_type = 'actionable';
                }

                item.blackListId = blackListId;
            }, this);

            /* Group the output by form reference */
            items = _.groupBy(items, 'reference');

            // Merge all the task data for each reference
            items = _.map(items, function(items, ref) {
                return _.extend.apply(_, [{
                    reference: ref
                }].concat(items));
            });

            items = _.map(items, function(form_details){
                if(form_details.status === "Saved"){
                    form_details.canContinue = true;
                    form_details.canView = false;
                    form_details.task_type = "actionable";
                }
                return form_details;
            });

            return {
                items: items
            };
        };

        var _transformData = function(data) {
            data.transformed = {};
            data.content = JSON.parse(window.atob(data.content));

            if (data.metadata && data.metadata.length) {
                _.each(data.metadata, function(v) {
                    data.transformed[v.Name] = v.Value;
                });
            }

            return data;
        };

    };

    return new Requests();
}));
