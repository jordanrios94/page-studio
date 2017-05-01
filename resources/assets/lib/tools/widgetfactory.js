(function(root, factory) {
    var _ = root._ || require('lodash');
    var dependencies = ['lodash', 'jquery', 'bluebird'];

    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(this, _.map(dependencies, require));
    } else {
        root.FS = root.FS || {};
        root.FS.WidgetFactory = factory(root._, root.jQuery, root.Promise);
    }
}(this, function(_, $, Promise) {
    if(!_) throw new Error('Underscore.js is not available');
    if(!$) throw new Error('jQuery.js is not available');
    if(!Promise) throw new Error('Bluebird.js is not available');

    /**
     * A constructor for defining new widgets
     */
    var Widget = function Widget( widget ) {
        _.defaults(widget, {Id: 0, config: {}, appId: '', appUrl: '', name: '', type: '', src: '', entry: '', requires: [], appManifest: {}, username: '', frame_width: '', frame_height: ''});
        this.widgetId = widget.Id;
        this.widgetConfig = widget.config;
        this.appId = widget.appId;
        this.appUrl = widget.appUrl;
        this.appManifest = widget.appManifest;
        this.name = widget.name;
        this.type = widget.type;
        this.src = widget.src;
        this.mode = widget.mode;
        this.entry = widget.entry;
        this.requires = widget.requires;
        this.username = widget.username;
        this.pageName = widget.pageName;
        this.settings = widget.settings;
        this.frame_width = widget.frame_width;
        this.frame_height = widget.frame_height;
    };

    Widget.prototype.render = function(){
        var widgetContext = {
            widget: {
                name: this.name,
                id: this.widgetId,
                config: this.widgetConfig,
                settings: this.widgetSettings
            },
            app: this.appManifest,
            baseUrl: this.appUrl
        };

        return FS.Template(this.appManifest.name + '/' + this.entry, widgetContext);
    };

    Widget.prototype.load = function(){
        if (this.settings) {
            this.requires = this.requires.concat(this.settings.requires);
        };
        var requires = _.map(this.requires, function(content){
            content.url = this.appUrl;
            content.appName = this.appManifest.name;
            return content;
        }, this);
        return FS.Resources.loadContent(requires)
            .bind(this)
            .then(function(){return this;});
    };

    /**
     * Static based widget
     * @constructor
     */
    var StaticWidget = function StaticWidget() {
        Widget.apply(this, arguments);
    };

    StaticWidget.prototype = new Widget({});

    /**
     * External based widget
     * @constructor
     */
    var ExternalWidget = function ExternalWidget() {
        Widget.apply(this, arguments);
    };

    ExternalWidget.prototype = new Widget({});

    ExternalWidget.prototype._getWidgetKey = function(){
        return (this.appManifest.name + '-' + this.name).replace(/[^a-z0-9-]/gi, '_');
    };

    ExternalWidget.prototype._getIFrame = function(session){
        var authSession = session ? session["auth-session"] : '';
        var url = encodeURI(this.src + '?appsid=' + authSession + '&host=' + window.location.origin + '/' + '&path=' + this.appUrl);
        var frame_width, frame_height = false;

        frame_width = this.frame_width ? this.frame_width : '100%';
        frame_height = this.frame_height ? this.frame_height : '100%';
        return '<iframe src="' + url + '" class="fs-external-widget" height="' + frame_height + '" width="' + frame_width + '" frameborder="0"></iframe>';
    };

    ExternalWidget.prototype.render = function() {
        return FS.Auth.getWidgetSession(this._getWidgetKey())
            .bind(this)
            .then(this._getIFrame);       
    };

    /**
     * Template based widget
     * @constructor
     */
    var TemplateWidget = function TemplateWidget() {
        Widget.apply(this, arguments);
    };

    TemplateWidget.prototype = new Widget({});

    /**
     * Forms based widget
     * @constructor
     */
    var FormWidget = function FormWidget() {
        Widget.apply(this, arguments);
    };

    FormWidget.prototype = new Widget({});

    FormWidget.prototype.load = function() {
        var requires = _.map(this.requires, function(content){
            content.url = this.appUrl;
            return content;
        }, this);

        if (this.src) {
            return FS.Resources.loadExternalFormDefinition(this.src)
            .bind(this)
            .then(function(formDefinition){
                this.widgetConfig.formDefinition = formDefinition.fileContent;
                return this;
            })
        } else {
            return FS.Resources.loadContent(_.filter(requires, function(require) {
                return require.type !== "form";
            }))
            .then(function() {
                return FS.Resources.loadFormDefinition(_.where(requires, { type: "form" }));
            })
            .bind(this)
            .then(function(formDefinitions){
                if (_.isArray(formDefinitions) && formDefinitions[0]) {
                    this.widgetConfig.formDefinition = formDefinitions[0].fileContent;
                }
                return this;
            });
        }
    };

    FormWidget.prototype.render = function() {
        return FS.Template(this.entry, { 
            params: { 
                form_definition: this.widgetConfig.formDefinition, 
                mode: this.mode,
                redirectlink: '/Service/ServiceRating?serviceid=' + this.widgetConfig.formDefinition.props.id + '&service=R4&uri=/module/services'
            } 
        });
    };

    var ExternalTemplatedWidget = function ExternalTemplatedWidget() {
        Widget.apply(this, arguments);
    };

    ExternalTemplatedWidget.prototype = new Widget({});

    ExternalTemplatedWidget.prototype.render = function() {
        return encodeURI("index.html" + '?host=' + window.location.origin + window.location.pathname +
            '&template=' + this.entry +
            '&appName=' + this.pageName +
            '&widgetName=' + this.name +
            '&parentContainer=' + this.type + '-' + this.widgetId +
            '&appPageName=' + this.pageName);
    };

    /**
     * WidgetFactory constructor
     * @constructor
     */
    var WidgetFactory = function WidgetFactory(){};

    /**
     * Our Factory method for creating new Widget instances
     * @returns Array
     * @param widgets Array
     */
    WidgetFactory.prototype.createWidgets = function ( widgets ) {
        return _.map(widgets, function(widget){
            switch ( widget.type ) {
                case "static":
                    return new StaticWidget(widget);
                case "external":
                    return new ExternalWidget(widget);
                case "template":
                    return new TemplateWidget(widget);
                case "form":
                    return new FormWidget(widget);
                case "external-templated":
                    return new ExternalTemplatedWidget(widget);
                default:
                    throw new Error('Widget type is not specified.');
            }
        });
    };

    return WidgetFactory;
}));