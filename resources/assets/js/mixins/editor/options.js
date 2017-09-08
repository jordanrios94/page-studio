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
                colPhoneWidth: [
                    'col-xs-1','col-xs-2','col-xs-3','col-xs-4','col-xs-5','col-xs-6',
                    'col-xs-7','col-xs-8','col-xs-9','col-xs-10','col-xs-11','col-xs-12'
                ],
                colTabletWidth: [
                    'col-sm-1','col-sm-2','col-sm-3','col-sm-4','col-sm-5','col-sm-6',
                    'col-sm-7','col-sm-8','col-sm-9','col-sm-10','col-sm-11','col-sm-12'
                ],
                colLaptopWidth: [
                    'col-md-1','col-md-2','col-md-3','col-md-4','col-md-5','col-md-6',
                    'col-md-7','col-md-8','col-md-9','col-md-10','col-md-11','col-md-12'
                ],
                colDesktopWidth: [
                    'col-lg-1','col-lg-2','col-lg-3','col-lg-4','col-lg-5','col-lg-6',
                    'col-lg-7','col-lg-8','col-lg-9','col-lg-10','col-lg-11','col-lg-12'
                ],
                colPhoneOffset: [
                    'col-xs-offset-0','col-xs-offset-1','col-xs-offset-2','col-xs-offset-3','col-xs-offset-4','col-xs-offset-5','col-xs-offset-6',
                    'col-xs-offset-7','col-xs-offset-8','col-xs-offset-9','col-xs-offset-10','col-xs-offset-11','col-xs-offset-12'
                ],
                colTabletOffset: [
                    'col-sm-offset-0','col-sm-offset-1','col-sm-offset-2','col-sm-offset-3','col-sm-offset-4','col-sm-offset-5','col-sm-offset-6',
                    'col-sm-offset-7','col-sm-offset-8','col-sm-offset-9','col-sm-offset-10','col-sm-offset-11','col-sm-offset-12'
                ],
                colLaptopOffset: [
                    'col-md-offset-0','col-md-offset-1','col-md-offset-2','col-md-offset-3','col-md-offset-4','col-md-offset-5','col-md-offset-6',
                    'col-md-offset-7','col-md-offset-8','col-md-offset-9','col-md-offset-10','col-md-offset-11','col-md-offset-12'
                ],
                colDesktopOffset: [
                    'col-lg-offset-0','col-lg-offset-1','col-lg-offset-2','col-lg-offset-3','col-lg-offset-4','col-lg-offset-5','col-lg-offset-6',
                    'col-lg-offset-7','col-lg-offset-8','col-lg-offset-9','col-lg-offset-10','col-lg-offset-11','col-lg-offset-12'
                ],
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
