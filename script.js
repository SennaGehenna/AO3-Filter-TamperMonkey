// ==UserScript==
// @name         AO3 auto-remove keywords
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a script that detects whether or not certain the "additional fields" filter is set to the desired keywords and reloads the page with the filter set
// @author       You
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';



    /*
     *  THIS IS WHERE YOU ADD KEYWORDS YOU WISH TO REMOVE
     *  you can add an asterisk * at any place as a wildcard (for potentially infinite letters)
     */

    var filteredKeyWords = [
        "futa*",
        "futanari*"
    ];









    function isSiteFor(reg) {
        return document.URL.match(RegExp(reg)) != null;
    }

    var websiteUrl = document.URL;

    var worksRegex = "/works.*";
    var tagsRegex = "/tags/.*/works.*";
    var userRegex = "/users.*/works.*";
    var bookmarksRegex = "/users.*/bookmarks.*"
    var searchRegex = "/works.*/search";

    if(!isSiteFor(searchRegex) && (isSiteFor(worksRegex) || isSiteFor(tagsRegex) || isSiteFor(userRegex) || isSiteFor(bookmarksRegex))){

        var keyWords = filteredKeyWords.join();

        var params = new URLSearchParams(window.location.search);
        var excludedParams = params.get("work_search[excluded_tag_names]");

        var isMissingParams = false;

        if(excludedParams != null){
            for(var i = 0; i < filteredKeyWords.length; ++i){
                 if(excludedParams.match(RegExp(filteredKeyWords[i])) == null){
                     isMissingParams = true;
                     break;
                 }
            }
        } else {
            isMissingParams = true;
        }

        console.log("isMissingParams: "+isMissingParams);

        if(isMissingParams){

            var newUrl = new URL(document.URL);
            if(newUrl.searchParams == null){
                newUrl.searchParams = new URLSearchParams();
            }
            var newParams = newUrl.searchParams.get("work_search[excluded_tag_names]");
            if(newParams == null){
                newParams = [];
            }else {
             newParams = newParams.split(",");
            }
            for(var j = 0; j < filteredKeyWords.length; ++j){
                if(newParams.indexOf(filteredKeyWords[j]) == -1){
                    newParams.push(filteredKeyWords[j]);
                }
            }
            newUrl.searchParams.set("work_search[excluded_tag_names]",newParams.join());
            console.log(newUrl.searchParams);
            window.location = newUrl;
        }
    }
})();
