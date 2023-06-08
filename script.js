// ==UserScript==
// @name         AO3 auto-remove keywords
// @namespace    sennagehenna.github.io
// @version      0.1
// @description  a script that detects whether or not certain the "additional fields" filter is set to the desired keywords and reloads the page with the filter set
// @author       Anna Fall
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
		
		//we get the URL of the current website and check if it contains the part "reg" that we supplied
		
        return document.URL.match(RegExp(reg)) != null;
    }

    var websiteUrl = document.URL;

    var worksRegex = "/works.*";
    var tagsRegex = "/tags/.*/works.*";
    var userRegex = "/users.*/works.*";
    var bookmarksRegex = "/users.*/bookmarks.*"
    var searchRegex = "/works.*/search";


    //we check if we're on an AO3 page that contains fanfics
    if(!isSiteFor(searchRegex) && (isSiteFor(worksRegex) || isSiteFor(tagsRegex) || isSiteFor(userRegex) || isSiteFor(bookmarksRegex))){

        var keyWords = filteredKeyWords.join();

        var params = new URLSearchParams(window.location.search);
        var excludedParams = params.get("work_search[excluded_tag_names]");

        var isMissingParams = false;



        // we check if everything we want to filter out is already being filtered or not
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



		//if the filter is incomplete, we add our custom filtered keywords to the filter and reload the page with the new filter
        if(isMissingParams){

            var newUrl = new URL(document.URL);
            var newParams = newUrl.searchParams.get("work_search[excluded_tag_names]").split(",");
            for(var j = 0; j < filteredKeyWords.length; ++j){
                if(newParams.indexOf(filteredKeyWords[j]) == -1){
                    newParams.push(filteredKeyWords[j]);
                }
            }
            newUrl.searchParams.set("work_search[excluded_tag_names]",newParams.join());
            window.location = newUrl;
        }
    }
})();
