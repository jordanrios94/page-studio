module.exports = {
    methods: {
        hasAttribute(style, attribute, value) {
            return style + ((this.elementNode.attr(attribute) === value) ? ' active' : '');
        },
        hasClass(style, className, baseStyle = this.element.style) {
            const elementClass = baseStyle ? baseStyle + '-' + className : className;
            return style + (this.elementNode.hasClass(elementClass) ? ' active' : '');
        },
        hasClasses(style, classes) {
            let hasClass = false;
            
            classes.forEach(className => {
                if (this.elementNode.hasClass(className)) {
                    hasClass = true;
                }
            }, this);

            return style + (!hasClass ? ' active' : '');
        },
        changeAttribute(e, name, value) {
            e.preventDefault();
            this.elementNode.attr(name, value.trim());
            this.updateTree(_.clone(this.tree));
        },
        changeClass(e, chosenStyle, type, style = this.element.style) {
            e.preventDefault();
            const styles = {
                standard: ['default','primary','success','info','warning','danger'],
                alignment: ['left','center','right','justify','nowrap'],
                sizes: ['xs','sm','md','lg'],
                textTransform: ['lowercase','uppercase','capitalize'],
                image: ['rounded','circle','thumbnail'],
                btnWidth: ['block'],
                btnState: ['active','disabled'],
                progressBarAnimation: ['active'],
                progressBarStripes: ['striped'],
                responsive: ['responsive'],
                reverse: ['reverse'],
                lead: ['lead']
            };

            this.updateBootstrapClass(styles[type], style, chosenStyle);
        },
        updateBootstrapClass(classes, bootstrapClass, chosenClass) {
            bootstrapClass = (!_.isEmpty(bootstrapClass)) ? bootstrapClass + '-' : '';
            
            for (let i = 0; i < classes.length; i++) {
                const className = bootstrapClass + classes[i];
                this.elementNode.removeClass(className);
            }

            if (!_.isEmpty(chosenClass)){
                this.elementNode.addClass(bootstrapClass + chosenClass);
            }

            this.updateTree(_.clone(this.tree));
        }
    }
};
