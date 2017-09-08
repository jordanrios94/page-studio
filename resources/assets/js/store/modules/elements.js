const column = {
    name: 'Column',
    style: 'text',
    editable: ['id','class','colWidth','colOffset']
};

const header = {
    name: 'Heading',
    style: 'text',
    editable: ['id','class','style']
};

module.exports = {
    state: {
        'alert': { 
            name: 'Alert',
            style: 'alert',
            editable: ['id','class','style'] 
        },
        'dropdown': { 
            name: 'Dropdown',
            editable: ['id','class'] 
        },
        'btn': {
            name: 'Button',
            style: 'btn',
            editable: ['id','class','style','href','btnWidth','size','target','state']
        },
        'btn-group': {
            name:'Button Group',
            style: 'text',
            item: '.btn',
            editable:['id','class','items']
        },
        'panel': {
            name:'Panel',
            style:'panel',
            editable: ['id','class','style','alignment']
        },
        'jumbotron': {
            name: 'Jumbotron',
            editable: ['id','class']
        },
        'breadcrumb': {
            name:'Breadcrumb',
            editable:['id','class']
        },
        'caption': {
            name: 'Caption',
            editable: ['id','class']
        },
        'thumbnail': {
            name: 'Thumbnail',
            editable: ['id','class']
        },
        'list-group': {
            name: 'List Group',
            style: 'text',
            item: '.list-group-item',
            editable: ['id','class','style','alignment','items']
        },
        'list-group-item': {
            name: 'List Group Item',
            style: 'list-group-item',
            editable: ['id','class','style','href','state','alignment']
        },
        'page-header': {
            name: 'Page Header',
            editable: ['id','class']
        },
        'panel-heading': {
            name: 'Panel Heading',
            style: 'text',
            editable: ['id','class']
        },
        'panel-body': {
            name: 'Panel Body',
            style: 'text',
            editable: ['id','class','style']
        },
        'panel-footer': {
            name: 'Panel Footer',
            style: 'text',
            editable: ['id','class','style']
        },
        'progress-bar': {
            name: 'Progress Bar',
            style: 'progress-bar',
            editable: ['id','class','style','stripes','active']
        },
        'container': {
            name: 'Container',
            style: 'text',
            editable: ['id','class']
        },
        'row': {
            name: 'Row',
            style: 'text',
            editable: ['id','class']
        },
        'col-xs-1': column,
        'col-xs-2': column,
        'col-xs-3': column,
        'col-xs-4': column,
        'col-xs-5': column,
        'col-xs-6': column,
        'col-xs-7': column,
        'col-xs-8': column,
        'col-xs-9': column,
        'col-xs-10': column,
        'col-xs-11': column,
        'col-xs-12': column,
        'col-sm-1': column,
        'col-sm-2': column,
        'col-sm-3': column,
        'col-sm-4': column,
        'col-sm-5': column,
        'col-sm-6': column,
        'col-sm-7': column,
        'col-sm-8': column,
        'col-sm-9': column,
        'col-sm-10': column,
        'col-sm-11': column,
        'col-sm-12': column,
        'col-md-1': column,
        'col-md-2': column,
        'col-md-3': column,
        'col-md-4': column,
        'col-md-5': column,
        'col-md-6': column,
        'col-md-7': column,
        'col-md-8': column,
        'col-md-9': column,
        'col-md-10': column,
        'col-md-11': column,
        'col-md-12': column,
        'col-lg-1': column,
        'col-lg-2': column,
        'col-lg-3': column,
        'col-lg-4': column,
        'col-lg-5': column,
        'col-lg-6': column,
        'col-lg-7': column,
        'col-lg-8': column,
        'col-lg-9': column,
        'col-lg-10': column,
        'col-lg-11': column,
        'col-lg-12': column,
        'h1': header,
        'h2': header,
        'h3': header,
        'h4': header,
        'h5': header,
        'h6': header,
        'img': {
            name: 'Image',
            style: 'img',
            editable: ['id','class','src','alt','image','responsive']
        },
        'p': {
            name: 'Paragraph',
            style: 'text',
            editable: ['id','class','style','lead','alignment','textTransform']
        },
        'ul': {
            name:'Unordered List',
            editable:['id','class']
        },
        'ol': {
            name:'Ordered List',
            editable:['id','class']
        },
        'li': {
            name: 'List Item',
            style: 'text',
            editable: ['id','class','style']
        },
        'a': {
            name: 'Link',
            style: 'text',
            editable: ['id','class','style','href']
        },
        'div': {
            name: 'Div',
            editable: ['id','class']
        },
        'blockquote': {
            name: 'Blockquote',
            style: 'blockquote',
            editable: ['id','class','reverse']
        },
        'footer': {
            name: 'Footer',
            style: 'text',
            editable: ['id','class','style']
        },
        'small': {
            name: 'Small',
            style: 'text',
            editable: ['id','class','style']
        },
        'body': {
            name: 'Body',
            editable: []
        },
        'span': {
            name: 'Span',
            editable: ['id','class']
        },
        'input': {
            name: 'Input',
            editable: ['id','class']
        },
        'form': {
            name: 'Form',
            editable: ['id','class','action']
        },
        'label': {
            name: 'Label',
            editable:['id','class']
        },
        'legend': {
            name:'Legend',
            editable:['id','class']
        }
    }
};
