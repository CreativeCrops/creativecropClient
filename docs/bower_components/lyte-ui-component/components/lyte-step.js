Lyte.Component.register('lyte-step',{
_template:"<template tag-name=\"lyte-step\">\t<div onclick=\"{{action('divClick', event, this)}}\">\t\t<template is=\"if\" value=\"{{expHandlers(ltPropYield,'==',false)}}\"><template case=\"true\">\t\t\t\t\t<lyte-step-structure class=\"{{ltPropClass}}\" onclick=\"{{action('divClick', event, this)}}\">\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropData}}\" item=\"array\" index=\"indexVal\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(array),'==',false)}}\"><template case=\"true\"><template is=\"if\" value=\"{{expHandlers(ltPropClass,'==','lyteStageOne')}}\"><template case=\"true\">\t\t\t\t \t\t\t\t\t\t\t  <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick', event, this, array)}}\"> \t  <lyte-step-body> {{array}} </lyte-step-body> \t\t\t\t \t\t\t\t\t\t\t\t\t<lyte-step-head>{{indexVal}}</lyte-step-head>\t\t\t\t \t\t\t\t\t\t\t\t</lyte-step-item>\t\t\t\t \t\t\t\t\t\t\t</template><template case=\"false\"> \t\t\t\t\t\t\t\t\t\t\t  <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick', event, this, array)}}\"> \t <lyte-step-body> {{array}} </lyte-step-body>\t\t\t\t\t\t\t\t\t\t\t\t</lyte-step-item>\t\t\t\t\t\t\t\t\t\t </template></template></template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropClass,'==','lyteStageOne')}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick', event, this, array)}}\"> \t\t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-step-body> {{array[ltPropLabel]}} </lyte-step-body> \t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-step-head>{{array[ltPropOption]}}</lyte-step-head>\t\t\t\t\t\t\t\t\t\t\t\t</lyte-step-item>\t\t\t\t\t\t\t\t\t\t\t</template><template case=\"false\"> \t\t\t\t\t\t\t\t\t\t\t   <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick', event, this, array)}}\"> \t\t\t\t\t\t\t\t\t\t\t\t   \t    <lyte-step-body> {{array[ltPropLabel]}} </lyte-step-body>\t\t\t\t\t\t\t\t\t\t\t   </lyte-step-item>\t\t\t\t\t\t\t\t\t\t  </template></template></template></template></template>\t\t\t\t\t</lyte-step-structure>\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t<lyte-yield yield-name=\"yield\"></lyte-yield>\t\t\t </template></template>\t\t</div>\t\t</template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"text","position":[1,3,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"text","position":[1,3,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropClass","ltPropData","ltPropSelected","ltPropSkip","ltPropActiveClass","ltPropCompletedClass","ltPropWarningClass","ltPropKeepMarked","ltPropYield","ltPropLabel","ltPropOption"],
    init : function(){
        if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }
    },
    didConnect : function (){
        var elements = $L('lyte-step-item', this.$node).e
        if(elements.length)
            {
                this.ArrayContentChange.call(this);
            }
           this.$node.next = function (state) {
                this.goto(parseInt(this.component.getData('ltPropSelected')) + 1, state, true) 
            },
            this.$node.previous = function (state) {
                this.goto((parseInt(this.component.getData('ltPropSelected')) - 1), state, true) 
            },
           this.$node.goto = function (number, state, flag) {
                    if(this.component.getData('ltPropSkip') || flag)
                        {
                            var elements = $L('lyte-step-item', this).e, ltPropSelected = this.component.getData('ltPropSelected'), ltPropWarningClass =  this.component.getData('ltPropWarningClass');
                            var selectedElement = elements[ltPropSelected], ltPropCompletedClass =  this.component.getData('ltPropCompletedClass'), ltPropActiveClass = this.component.getData('ltPropActiveClass')
                            if(number >= -1 &&  $L('lyte-step-item', this).e.length)
                                {
                                    if(state == 'incomplete')
                                        {
                                            selectedElement.classList.add(ltPropWarningClass)
                                        }
                                    else
                                        {
                                            selectedElement.classList.add(ltPropCompletedClass)
                                        }   
                                    selectedElement.classList.remove(ltPropActiveClass)
                                    if(number == $L('lyte-step-item', this).e.length)
                                        {
                                            number--;
                                        }
                                      else if(number == -1)
                                        {
                                            number++;
                                        }  
                                    elements[number].classList.add(ltPropActiveClass);
                                    if(number == ltPropSelected)
                                        {
                                            selectedElement.classList.remove(ltPropWarningClass);
                                            selectedElement.classList.remove(ltPropCompletedClass);
                                        }
                                    else      
                                        {
                                            this.component.setData('ltPropSelected', number);
                                        }          
                                }
                        }
                }
          this.breadcrumbClass.call(this);  
          if(this.getMethods('afterRender'))
            {
                this.executeMethod('afterRender', this.$node);
            }    
     },

     selectedElementFindObs : function(){
        $L.fastdom.measure(function(){
            this.selectedElementFind.call(this);
        }.bind(this))
     }.observes('ltPropSelected'),

    selectedElementFind : function (){
        var ltPropSelected = parseInt(this.getData('ltPropSelected')), ltPropActiveClass = this.getData('ltPropActiveClass'), elements = $L('lyte-step-item', this.$node).e, ltPropComplete = this.getData('ltPropCompletedClass'), ltPropWarningClass = this.getData('ltPropWarningClass');
        if(elements.length)
            {
                var length = this.getData('ltPropKeepMarked') ? ltPropSelected : (elements.length -1);
                $L('lyte-step-item', this.$node).removeClass(ltPropActiveClass)
                elements[ltPropSelected].classList.add(ltPropActiveClass)
                elements[ltPropSelected].classList.remove(ltPropWarningClass)
                elements[ltPropSelected].classList.remove(ltPropComplete)
                for(var i = 0; i <= length; i++)
                    {
                        if(i < ltPropSelected)
                            {
                                if(!elements[i].classList.contains(ltPropWarningClass))
                                    {
                                        elements[i].classList.add(ltPropComplete)
                                    }
                            }
                        else if(i > ltPropSelected)
                           {
                                elements[i].classList.remove(ltPropWarningClass)
                                elements[i].classList.remove(ltPropComplete)
                           } 
                            
                    }
            }
    },

    ArrayContentChangeObs : function(){
        this.ArrayContentChange.call(this);
    }.observes('ltPropData.[]'),

    ArrayContentChange : function (){
        if(this.getData('ltPropSelected') == undefined)      
            {
                this.setData('ltPropSelected',0)
            }
        else
            {
                this.selectedElementFind.call(this);
            } 
    },

    breadcrumbClassObs : function(){
        this.breadcrumbClass.call(this);
    }.observes('ltPropClass'),

    breadcrumbClass : function(){
        if(this.getData('ltPropYield'))
            {
                $L('lyte-step-structure', this.$node).e[0].classList.add(this.getData('ltPropClass'));
            }
    },
    data : function(){
        return {
            //  user data
            ltPropClass : Lyte.attr("string",{"default":'lyteStepSlash'}),
            ltPropData : Lyte.attr("array",{"default":[]}),
            ltPropSelected : Lyte.attr("number",{"default":0}),
            ltPropSkip : Lyte.attr("boolean",{"default": true}),
            ltPropActiveClass : Lyte.attr("string",{"default":'lyteActive'}),
            ltPropCompletedClass :Lyte.attr("string",{"default": 'lyteCompleted'}),
            ltPropWarningClass : Lyte.attr("string",{"default":'lyteWarning'}),
            ltPropKeepMarked : Lyte.attr("boolean",{"default": false}),
            ltPropYield : Lyte.attr("boolean",{"default": false}),
            ltPropLabel : Lyte.attr('string', {'default': ''}),
            ltPropOption : Lyte.attr('string', {'default': ''})
        }
    },
    actions : {
        'onclick' : function (event, Component, data){
            if((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank'){return false;}
            if(this.getMethods('onClick'))
                {
                   this.executeMethod('onClick', Component, this.$node, event, data);
                   event.stopPropagation();  
                }
        },
        divClick : function(event, div){
            if((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank'){return false;}
            if(this.getMethods('onClick') && this.getData('ltPropYield'))
                {
                    var node = event.target;
                    while(node != div)
                        {
                            if(node.tagName == 'LYTE-STEP-ITEM')
                                {
                                    this.executeMethod('onClick', node, this.$node, event, node.getAttribute('data-value'))
                                    break;
                                }
                              else
                                {
                                    node =  node.parentElement;
                                }  
                        }
                }
        }
    }       
});