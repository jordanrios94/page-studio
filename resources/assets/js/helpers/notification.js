module.exports = new class {
    constructor() {
        this.gritter = $.gritter;
    }

    validType(type) {
        const types = ['primary', 'success', 'info', 'warning', 'danger'];

        return _.includes(types, type);
    }

    addMessage(title, text, type) {
        if (!this.validType(type)) return console.error('The type for gritter is not valid');

        this.gritter.add({
            title: title,
            text: text,
            class_name: 'color ' + type
        });
    }
};