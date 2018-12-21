(function() {
  if($L) {
    $L.prototype.cruxMention = function(featureObj) {
      //here 'this' points to $L(selector);
      var mentionInputBox = this.e;
      var features = featureObj ? featureObj : {};

      //default values for features provided by cruxMention plugin
      var defaultFeatures = {
        textboxSelector: "", //NO i18n
        searchModules: ["users", "groups", "roles"], //NO I18n
        minChars: 2,
        triggerChar: "@", //NO i18n
        componentName: "crux-mentions-body" //NO i18n
      }

      // initializing data attributes.
      var textboxSelector = features.textboxSelector ? features.textboxSelector : defaultFeatures.textboxSelector;
      var searchModules = features.searchModules ? features.searchModules : defaultFeatures.searchModules;
      var mode = features.mode ? features.mode : defaultFeatures.mode;
      var minChars = features.minChars > 0 ? features.minChars : defaultFeatures.minChars;
      var triggerChar = features.triggerChar ? features.triggerChar : defaultFeatures.triggerChar;
      var componentName = features.componentName ? features.componentName : defaultFeatures.componentName;

      //utility methods

      // mentionsInput starts here
      this.mentionsInput({
        'minChars': minChars, //NO i18n
        'triggerChar': triggerChar, //NO i18n
        'dropbody': false, //NO i18n
        'onDataRequest': function(query) { //NO i18n
          return store.findAll("search", {"searchword": query, "meta_resources": searchModules.join(), 'display_field': true}); //NO i18n
        },
        'displayMentions': function(mentions, mentionText) { //NO i18n
          if(mentions && mentions.length > 0) {
            //binds each component to its calling textbox.
            var bindingClass = textboxSelector.startsWith("#") || textboxSelector.startsWith(".") ? textboxSelector.slice(1) : textboxSelector;
            var cruxMentionComp = document.querySelector("#cruxMention." + bindingClass); //NO i18n
            var elem = document.querySelector(textboxSelector);

            if(!cruxMentionComp) {
              if(elem.nodeName === "TEXTAREA") {
                elem._mIData.lyteMIList.classList.add(bindingClass);
              } else if(elem.nodeName === "LYTE-INPUT") {
                elem.querySelector("textarea")._mIData.lyteMIList.classList.add(bindingClass); //NO i18n
              }

              cruxMentionComp = Lyte.Component.render(componentName, {'mentions': mentions, 'textboxSelector': textboxSelector, 'bindingClass': bindingClass, 'triggerChar': triggerChar, 'mentionText': mentionText}, "."+bindingClass); //NO i18n
              $L(elem.parentElement.querySelector("."+bindingClass)).addClass('lyteMIDisplayBlock'); //NO I18n

              cruxMentionComp.setAttribute("id", "cruxMention"); //NO i18n
              cruxMentionComp.setAttribute("class", bindingClass); //NO i18n
            } else {
              var mentionedMentions = cruxMentionComp.getData("mentionedMentions"); //NO i18n
              var mentionedMentionsLen = mentionedMentions.length;

              //filters out already mentioned mentions
              var unmentionedMentions = mentions.filter(function(mention) {
                var mentionFound = false;

                for(var i = 0; i < mentionedMentionsLen; i++) {
                  if(mentionedMentions[i].id === mention.id) {
                    mentionFound = true;
                    break;
                  }
                }

                //return false to prevent from being added to unmentionedMentions and true to be added to unmentionedMentions
                return !mentionFound;
              });

              cruxMentionComp.setData({
                'mentions': unmentionedMentions,  //NO i18n
                'textboxSelector': textboxSelector,  //NO i18n
                'triggerChar': triggerChar,  //NO i18n
                'mentionText': mentionText //NO i18n
              });
              cruxMentionComp.querySelector(".mentionBody").setAttribute("style", "display: block"); //NO i18n
              $L(elem.parentElement.querySelector("."+bindingClass)).addClass('lyteMIDisplayBlock'); //NO I18n
            }
          }
        }
      });
      // mentionsInput ends here
    }
  }
})();
