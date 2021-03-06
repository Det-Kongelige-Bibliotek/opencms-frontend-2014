/*global jQuery, SC*/
var kb_soundcloud = (function (window, $, undefined) {
    var LANGUAGE = window.kb_lang || 'da'; // Change this to either 'da' or 'en'
    var Kb_soundcloud = function (lang) {
        this.LANGUAGE = lang || LANGUAGE;
    };

    /**
     * Converts an url to a html a tag
     * @param url {String} The url
     * @param maxLength {Number} The maximum length of the url to show in the link. Chars beyond this will be cutted off in the text (not the href) and an ellipsis will be appended.
     * @return {String/html} The a-tag
     */
    var url2href = function (url, maxLength) {
        maxLength = maxLength || 37;
        var shortUrl = url.length > maxLength ? url.substr(0, maxLength) + '&hellip;' : url;
        return '<a href="' + url + '" target="_blank">' + shortUrl + '</a>';
    };

    Kb_soundcloud.prototype = {
        //CLIENTNAME: 'cortexcowboy',
        //CLIENTID: 'addc49835216955834db7171a0a41411',
        CLIENTNAME: 'detkongeligebibliotek',
        CLIENTID: 'a68ddd70609cc8bf03fe519310cfba01',
        //PLAYLIST: '//soundcloud.com/cortexcowboy/sets/kb-playlist',
        PLAYLISTID: '133593086',
        i18n: {
            'da' : {
                    'title' : 'Podcasts fra samlingerne', // This is replaced with the playlist name when working, but Soundcloud does not support IE9, so I can't fetch anything in IE9
                    'oldIE' : 'Du bruger en forældet browser, og kan derfor ikke lytte til vores lydklip.'
                },
            'en' : {
                    'title' : 'Podcasts',
                    'oldIE' : 'You are using a deprecated browser and can not listen to our soundbits.'
                }
        },

        /**
         * Converts a datestamp to a text "Offentliggjort d. DD/MM YYYY"
         * @param datestamp {String/date} Might be of any kind readable for Date - in this case it probably will be of the form YYYY/MM/DDTHH:mm:SS:ttttZ" or something like that?
         * @return {String} "Offentliggjort d. DD/MM YYYY"
         */
        datestamp2Text: function (datestamp) {
            var tmpDate = new Date(datestamp);
            if (LANGUAGE === 'da') {
                return 'Offentliggjort d. ' + tmpDate.getUTCDate() + '/' + (tmpDate.getUTCMonth()+1) + ' ' + tmpDate.getUTCFullYear();
            } else {
                return 'Published ' + tmpDate.getUTCDate() + '/' + (tmpDate.getUTCMonth()+1) + '/' + tmpDate.getUTCFullYear();
            }
        },

        /**
         * Format a text blob as the description is formatted in SoundCloud. This implies all urls converted to <a>-tags and linefeeds converted to <br>-tags
         */
        formatDescription : function (desc) {
            desc = desc.replace(/\b(https?\:\/\/\S*)\b/g, url2href);
            return desc.replace(/\n/g, '<br>\n');
        }
    };

    return new Kb_soundcloud();

})(window, jQuery);

//injecting SoundCloud API
(function(window, $, undefined) {
    // detect if browser is IE and < 11
    var unsupportedIE = navigator.userAgent.split('MSIE');
    if (unsupportedIE.length > 1) {
        if (parseInt(unsupportedIE[1].trim().split(' ')[0], 10) < 10) {
            // < IE10 => no soundcloud support - flash message and stop execution
            setTimeout(function () {
                $('#soundlist').html('<section class="deck mediadeck grid"><div class="container"><div class="row"><header class="text-center"><h2>' + kb_soundcloud.i18n[kb_soundcloud.LANGUAGE].title + '</h2><p class="lead">' + kb_soundcloud.i18n[kb_soundcloud.LANGUAGE].oldIE + '</p></header></div></div></div>');
            }, 0);
            return;
        }
    }
    var injectionPoint = $('head').find('script').last();
    var SCscript = document.createElement('script');
    var testForAPILoaded = function () {
            if ('undefined' === typeof window.SC) { // poor mans require!
                setTimeout(testForAPILoaded, 200);
            } else {
                window.onSoundcloudAPIReady();
            }
        };
    $(SCscript).ready(function () {
        testForAPILoaded();
    });
    SCscript.src = '//connect.soundcloud.com/sdk-2.0.0.js';
    injectionPoint.after(SCscript);
}(window, jQuery));

