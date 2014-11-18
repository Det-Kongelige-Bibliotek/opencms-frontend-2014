$(document).ready(function() {
    $('#kbMenuToggler').click(function () {
        $('body').toggleClass('showMenu');
    });

    //setTimeout(function () { $('#kbMenuToggler').click(); }, 500); // FIXME: only for test!

    var MOBILESTR = 'mobile',
        TABLETSTR = 'tablet',
        DESKTOPSTR = 'desktop',
        $body = $('body'),
        $topnavigation = $('.topnavigation'),
        MOBILE = 752, // magic-number 752 = 768 - 2 * 8px (window-borders?)
        TABLET = 1008, // magic-number 1008 = 1024 - 2 * 8px
        initialWidth = $(window).innerWidth(); // FIXME: switch to outerWidth instead?
    kbModus = initialWidth < MOBILE ? MOBILESTR : initialWidth < TABLET ? TABLETSTR : DESKTOPSTR;

    var setModus = function (modus) {
        $('body').removeClass(kbModus);
        kbModus = modus;
        $('body').addClass(kbModus);
    };

    var ajustHeaderHeight = function () {
        var scrollTop = $(window).scrollTop();
        if ((kbModus === DESKTOPSTR) && (scrollTop <= 100)) {
            if ($topnavigation.hasClass('minified')) {
                $topnavigation.removeClass('minified');
            }
        } else {
            if (!$topnavigation.hasClass('minified')) {
                $topnavigation.addClass('minified');
            }
        }
    }

    $body.addClass(kbModus); // Set the initial class on body

    $(window).resize(function (){
        var innerWidth = $(window).innerWidth();
        if (innerWidth < MOBILE) {
            if (kbModus !== MOBILESTR) {
                setModus(MOBILESTR);
                ajustHeaderHeight();
            }
        } else if (innerWidth < TABLET) {
            if (kbModus !== TABLETSTR) {
                setModus(TABLETSTR);
                ajustHeaderHeight();
            }
        } else {
            if (kbModus !== DESKTOPSTR) {
                if (kbModus === TABLETSTR) { // if we come from the tablet view, close menu (if it is present).
                    $body.removeClass('showMenu');
                }
                setModus(DESKTOPSTR);
                ajustHeaderHeight();
            }
        }
    });

    // initialize the header size
    ajustHeaderHeight();

    //initialize listeners that toggles chevrons
    $.each($('.chevronpart'), function(index, chevron) {
        $(chevron).click(function (e) {
            if ($($(this).attr('data-target')).hasClass('in')) {
                $('.glyphicon', this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            } else {
                $('.glyphicon', this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
        });
    });

    //scrollspy
    $(window).scroll(ajustHeaderHeight);
});
