<template>
    <div class="layout-panel" v-show="isActive">
        <left-aside></left-aside>
        <div class="main-content">
            <iframe id="clientframe" src="/page/layout/bootstrap" width="100%" height="100%" disablehistory="true" frameborder="0"></iframe>
        </div>
        <right-aside></right-aside>
    </div>
</template>
<script>
    export default {
        props: {
            'type': {
                type: String
            },
            'selected': {
                type: Boolean,
                default: false
            }
        },
        components: {
            'left-aside': require('./LeftAside.vue'),
            'right-aside': require('./RightAside.vue')
        },
        data() {
            return {
                isActive: false
            };
        },
        created() {
            const vm = this;

            Event.$on('tab-selected', function ($event) {
                vm.isActive = (vm.type == $event.type);
            });
        },
        mounted() {
            this.isActive = this.selected;
            this.init();
        },
        methods: {
            update(value) {
                this.$store.commit('update', {
                    setting: this.type,
                    value: value
                });
            },
            init() {
                let countdown;
                let currentElement;
                let elementRectangle;
                let currentElementChangeFlag;
                let dragoverqueue_processtimer;

                const vm = this;
                const clientFrameWindow = $('#clientframe').get(0).contentWindow;
                
                $('#dragitemslistcontainer .list-group-item').on('dragstart',function(event) {
                    dragoverqueue_processtimer = setInterval(function() {
                        DragDropFunctions.processDragOverQueue();
                    }, 100);

                    const insertingHTML = $(this).attr('data-insert-html');
                    event.originalEvent.dataTransfer.setData('Text', insertingHTML);
                });

                $('#dragitemslistcontainer .list-group-item').on('dragend',function() {
                    clearInterval(dragoverqueue_processtimer);
                    DragDropFunctions.removePlaceholder();
                    DragDropFunctions.clearContainerContext();
                });

                $('#clientframe').load(function() {
                    const htmlBody = $(clientFrameWindow.document).find('body,html');

                    htmlBody.find('*').andSelf()
                    .on('dragenter',function(event) {
                        event.stopPropagation();
                        currentElement = $(event.target);
                        currentElementChangeFlag = true;
                        elementRectangle = event.target.getBoundingClientRect();
                        countdown = 1;
                    })
                    .on('dragover', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        if (countdown % 15 != 0 && currentElementChangeFlag == false) {
                            countdown = countdown + 1;
                            return;
                        }

                        event = event || window.event;

                        const x = event.originalEvent.clientX;
                        const y = event.originalEvent.clientY;
                        const mousePosition = {x,y};

                        countdown = countdown + 1;
                        currentElementChangeFlag = false;

                        DragDropFunctions.addEntryToDragOverQueue(currentElement, elementRectangle, mousePosition)
                    });

                    $(clientFrameWindow.document).find('body,html').on('drop',function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        let e = event.isTrigger ? triggerEvent.originalEvent : event.originalEvent;

                        try {
                            const textData = e.dataTransfer.getData('text');
                            const insertionPoint = $("#clientframe").contents().find(".drop-marker");
                            const checkDiv = $(textData);

                            insertionPoint.after(checkDiv);
                            insertionPoint.remove();
                        } catch(e) {
                            console.error(e);
                        }
                    });

                    $(clientFrameWindow.document).find('body').on('click', event => {
                        event.preventDefault();
                        event.stopPropagation();

                        let domTree = [];
                        let e = event.isTrigger ? triggerEvent.originalEvent : event.originalEvent;

                        e.path.forEach(element => {
                            const invalidNodes = ['','shadow','i','#document-fragment','html','#document','strong','em','br','hr'];
                            const name = element.localName || element.nodeName || element.name;

                            if (!invalidNodes.includes(name)) {
                                domTree.push(element);
                            }
                        }, this);

                        Event.$emit('update-aside', {
                            tree: domTree.reverse()
                        });
                    });
                });

                const DragDropFunctions = {
                    dragoverqueue: [],
                    getMouseBearingsPercentage($element, elementRect, mousePos) {
                        if (!elementRect) {
                            elementRect = $element.get(0).getBoundingClientRect();
                        }

                        const mousePosPercent_X = ((mousePos.x-elementRect.left)/(elementRect.right-elementRect.left)) * 100;
                        const mousePosPercent_Y = ((mousePos.y-elementRect.top) /(elementRect.bottom-elementRect.top)) * 100;
                        
                        return {
                            x: mousePosPercent_X,
                            y: mousePosPercent_Y
                        };
                    },
                    orchestrateDragDrop($element, elementRect, mousePos) {
                        if (!$element || $element.length == 0 || !elementRect || !mousePos) return false;

                        if ($element.is('html')) {
                            $element = $element.find('body');
                        }

                        const breakPointNumber = {x:5,y:5};
                        const mousePercents = this.getMouseBearingsPercentage($element,elementRect,mousePos);

                        if ((mousePercents.x > breakPointNumber.x && mousePercents.x < 100-breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100-breakPointNumber.y)) {
                            let $tempelement;

                            $tempelement = $element.clone();
                            $tempelement.find('.drop-marker').remove();
                            if ($tempelement.html() == '' && !this.checkVoidElement($tempelement)) {
                                if (mousePercents.y < 90) {
                                    return this.placeInside($element);
                                }
                            } else if($tempelement.children().length == 0) {
                                this.decideBeforeAfter($element,mousePercents);
                            } else if($tempelement.children().length == 1) {
                                this.decideBeforeAfter($element.children(':not(.drop-marker,[data-dragcontext-marker])').first(),mousePercents);
                            } else {
                                const positionAndElement = this.findNearestElement($element,mousePos.x,mousePos.y);
                                this.decideBeforeAfter(positionAndElement.el,mousePercents,mousePos);
                            }
                        } else if ((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y)) {
                            let validElement = null;

                            if (mousePercents.y <= mousePercents.x) {
                                validElement = this.findValidParent($element, 'top');
                            } else {
                                validElement = this.findValidParent($element, 'left');
                            }

                            if (validElement.is('body,html')) {
                                validElement = $('#clientframe').contents().find('body').children(':not(.drop-marker,[data-dragcontext-marker])').first();
                            }

                            this.decideBeforeAfter(validElement, mousePercents, mousePos);
                        } else if ((mousePercents.x >= 100-breakPointNumber.x) || (mousePercents.y >= 100-breakPointNumber.y)) {
                            var validElement = null;

                            if(mousePercents.y >= mousePercents.x) {
                                validElement = this.findValidParent($element,'bottom');
                            } else {
                                validElement = this.findValidParent($element,'right');
                            }

                            if (validElement.is('body,html')) {
                                validElement = $('#clientframe').contents().find('body').children(':not(.drop-marker,[data-dragcontext-marker])').last();
                            }

                            this.decideBeforeAfter(validElement, mousePercents, mousePos);
                        }
                    },
                    decideBeforeAfter($targetElement, mousePercents, mousePos) {
                        if (mousePos) {
                            mousePercents = this.getMouseBearingsPercentage($targetElement,null,mousePos);
                        }

                        let $orientation;

                        $orientation = ($targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block");

                        if ($targetElement.is('br')) {
                            $orientation = false;
                        }

                        if ($orientation) {
                            if (mousePercents.x < 50) {
                                return this.placeBefore($targetElement);
                            } else {
                                return this.placeAfter($targetElement);
                            }
                        } else {
                            if (mousePercents.y < 50) {
                                return this.placeBefore($targetElement);
                            } else {
                                return this.placeAfter($targetElement);
                            }
                        }
                    },
                    checkVoidElement($element) {
                        const voidelements = ['i','area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','video','iframe','source','track','wbr'];
                        const selector = voidelements.join(',');

                        return $element.is(selector);
                    },
                    calculateDistance(elementData, mouseX, mouseY) {
                        return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
                    },
                    findValidParent($element, direction) {
                        switch (direction) {
                            case 'left':
                            case 'right':
                            case 'top':
                            case 'bottom':
                                while (true) {
                                    var elementRect = $element.get(0).getBoundingClientRect();
                                    var $tempElement = $element.parent();
                                    var tempElementRect = $tempElement.get(0).getBoundingClientRect();

                                    if ($element.is('body')) {
                                        return $element;
                                    }

                                    if (Math.abs(tempElementRect[direction] - elementRect[direction]) == 0) {
                                        $element = $element.parent();
                                    } else {
                                        return $element;
                                    }
                                }
                                break;
                        }
                    },
                    addPlaceHolder($element, position, placeholder) {
                        if (!placeholder) {
                            placeholder = this.getPlaceHolder();
                        }

                        this.removePlaceholder();
                        
                        switch (position) {
                            case 'before':
                                placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                                $element.before(placeholder);
                                this.addContainerContext($element,'sibling');
                                break;
                            case 'after':
                                placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                                $element.after(placeholder);
                                this.addContainerContext($element,'sibling');
                                break;
                            case 'inside-prepend':
                                placeholder.find(".message").html($element.data('sh-dnd-error'));
                                $element.prepend(placeholder);
                                this.addContainerContext($element,'inside');
                                break;
                            case 'inside-append':
                                placeholder.find(".message").html($element.data('sh-dnd-error'));
                                $element.append(placeholder);
                                this.addContainerContext($element,'inside');
                                break;
                        }
                    },
                    removePlaceholder() {
                        $('#clientframe').contents().find('.drop-marker').remove();
                    },
                    getPlaceHolder() {
                        return $('<li class="drop-marker"></li>');
                    },
                    placeInside($element) {
                        const placeholder = this.getPlaceHolder();
                        placeholder.addClass('horizontal').css('width', $element.width() + 'px');
                        this.addPlaceHolder($element, 'inside-append', placeholder);
                    },
                    placeBefore($element) {
                        const placeholder = this.getPlaceHolder();
                        let inlinePlaceholder = ($element.css('display') == 'inline' || $element.css('display') == 'inline-block');

                        if ($element.is('br')) {
                            inlinePlaceholder = false;
                        } else if($element.is('td,th')) {
                            placeholder.addClass('horizontal').css('width', $element.width() + 'px');
                            return this.addPlaceHolder($element, 'inside-prepend', placeholder);
                        }

                        if (inlinePlaceholder) {
                            placeholder.addClass('vertical').css('height', $element.innerHeight() + 'px');
                        } else { 
                            placeholder.addClass('horizontal').css('width', $element.parent().width() + 'px');
                        }

                        this.addPlaceHolder($element, 'before', placeholder);
                    },
                    placeAfter($element) {
                        var placeholder = this.getPlaceHolder();
                        var inlinePlaceholder = ($element.css('display') == 'inline' || $element.css('display') == 'inline-block');

                        if ($element.is('br')) {
                            inlinePlaceholder = false;
                        } else if ($element.is('td,th')) {
                            placeholder.addClass('horizontal').css('width', $element.width() + 'px');
                            return this.addPlaceHolder($element, 'inside-append', placeholder);
                        }

                        if (inlinePlaceholder) {
                            placeholder.addClass('vertical').css('height',$element.innerHeight() + 'px');
                        } else {
                            placeholder.addClass('horizontal').css('width',$element.parent().width() + 'px');
                        }

                        this.addPlaceHolder($element, 'after', placeholder);
                    },
                    findNearestElement($container, clientX, clientY) {
                        const _this = this;
                        let previousElData = null;
                        const childElement = $container.children(':not(.drop-marker,[data-dragcontext-marker])');

                        if (childElement.length > 0) {
                            childElement.each(function() {
                                if ($(this).is('.drop-marker')) {
                                    return;
                                }

                                const offset = $(this).get(0).getBoundingClientRect();
                                const xPosition1 = offset.left;
                                const xPosition2 = offset.right;
                                const yPosition1 = offset.top;
                                const yPosition2 = offset.bottom;
                                let distance = 0;
                                let distance1, distance2 = null;
                                let position = '';
                                let corner2 = null;
                                let corner1 = null;

                                if (clientY > yPosition1 && clientY <  yPosition2) {
                                    if (clientX < xPosition1 && clientY < xPosition2) {
                                        corner1 = { x:xPosition1, y:clientY, position:'before' };
                                    } else {
                                        corner1 = { x:xPosition2, y:clientY, position:'after' };
                                    }
                                } else if (clientX > xPosition1 && clientX < xPosition2) {
                                    if (clientY < yPosition1 && clientY < yPosition2) {
                                        corner1 = { x:clientX, y:yPosition1, position:'before' };
                                    } else {
                                        corner1 = { x:clientX, y:yPosition2, position:'after' };
                                    }
                                } else {
                                    if (clientX < xPosition1 && clientX < xPosition2) {
                                        corner1 = { x:xPosition1, y:yPosition1, position:'before' };
                                        corner2 = { x:xPosition1, y:yPosition2, position:'after' };
                                    } else if(clientX > xPosition1 && clientX > xPosition2) {
                                        corner1 = { x:xPosition2, y:yPosition1, position:'before' };
                                        corner2 = { x:xPosition2, y:yPosition2, position:'after' };
                                    } else if(clientY < yPosition1 && clientY < yPosition2) {
                                        corner1 = { x:xPosition1, y:yPosition1, position:'before' };
                                        corner2 = { x:xPosition2, y:yPosition1, position:'after' };
                                    } else if(clientY > yPosition1 && clientY > yPosition2) {
                                        corner1 = { x:xPosition1, y:yPosition2, position:'before' };
                                        corner2 = { x:xPosition2, y:yPosition2, position:'after' };
                                    }
                                }

                                distance1 = _this.calculateDistance(corner1, clientX, clientY);

                                if (corner2 !== null) {
                                    distance2 = _this.calculateDistance(corner2, clientX, clientY);
                                }

                                if (distance1 < distance2 || distance2 === null) {
                                    distance = distance1;
                                    position = corner1.position;
                                } else {
                                    distance = distance2;
                                    position = corner2.position;
                                }

                                if (previousElData !== null) {
                                    if (previousElData.distance < distance) {
                                        return true;
                                    }
                                }
                                
                                previousElData = { el: this, distance, xPosition1, xPosition2, yPosition1, yPosition2, position };
                            });

                            if (previousElData !== null) {
                                const position = previousElData.position;

                                return {
                                    el: $(previousElData.el),
                                    position
                                };
                            } else {
                                return false;
                            }
                        }
                    },
                    addEntryToDragOverQueue($element, elementRect, mousePos) {
                        const newEvent = [$element,elementRect,mousePos];
                        this.dragoverqueue.push(newEvent);
                    },
                    processDragOverQueue($element, elementRect, mousePos) {
                        const processing = this.dragoverqueue.pop();
                        this.dragoverqueue = [];

                        if (processing && processing.length == 3) {
                            const $el = processing[0];
                            const $elRect = processing[1];
                            const mousePos = processing[2];
                            this.orchestrateDragDrop($el, $elRect, mousePos);
                        }
                    },
                    getContextMarker() {
                        const $contextMarker = $('<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>');
                        return $contextMarker;
                    },
                    addContainerContext($element, position) {
                        let name;
                        const $iframe = $('#clientframe');
                        const $contextMarker = this.getContextMarker();
                        this.clearContainerContext();

                        if ($element.is('html,body')) {
                            position = 'inside';
                            $element = $iframe.contents().find('body');
                        }

                        switch (position) {
                            case 'inside':
                                this.positionContextMarker($contextMarker, $element);

                                if ($element.hasClass('stackhive-nodrop-zone')) {
                                    $contextMarker.addClass('invalid');
                                }
                                
                                name = this.getElementName($element);
                                $contextMarker.find('[data-dragcontext-marker-text]').html(name);

                                if ($iframe.contents().find('body [data-sh-parent-marker]').length != 0) {
                                    $iframe.contents().find('body [data-sh-parent-marker]').first().before($contextMarker);
                                } else {
                                    $iframe.contents().find('body').append($contextMarker);
                                }
                                break;
                            case 'sibling':
                                this.positionContextMarker($contextMarker, $element.parent());

                                if ($element.parent().hasClass('stackhive-nodrop-zone')) {
                                    $contextMarker.addClass('invalid');
                                }

                                name = this.getElementName($element.parent());
                                $contextMarker.find('[data-dragcontext-marker-text]').html(name);
                                $contextMarker.attr('data-dragcontext-marker', name.toLowerCase());

                                if ($iframe.contents().find('body [data-sh-parent-marker]').length != 0) {
                                    $iframe.contents().find('body [data-sh-parent-marker]').first().before($contextMarker);
                                } else {
                                    $iframe.contents().find('body').append($contextMarker);
                                }
                                break;
                        }
                    },
                    positionContextMarker($contextMarker,$element) {
                        const rect = $element.get(0).getBoundingClientRect();

                        $contextMarker.css({
                            height: (rect.height + 4) + 'px',
                            width: (rect.width + 4) + 'px',
                            top: (rect.top + $($('#clientframe').get(0).contentWindow).scrollTop() - 2) + 'px',
                            left: (rect.left + $($('#clientframe').get(0).contentWindow).scrollLeft() - 2) + 'px'
                        });

                        if (rect.top + $('#clientframe').contents().find('body').scrollTop() < 24) {
                            $contextMarker.find('[data-dragcontext-marker-text]').css('top','0px');
                        }
                    },
                    clearContainerContext() {
                        $("#clientframe").contents().find('[data-dragcontext-marker]').remove();
                    },
                    getElementName($element) {
                        let tagName = $element.prop('tagName').toLowerCase();
                        let className = $element.attr('class') ? '.' +  $element.attr('class') : '';

                        return tagName + className;
                    }
                };
            }
        }
    }
</script>
