if (!!$.prototype.justifiedGallery) { // if justifiedGallery method is defined
    var options = {
        rowHeight: 140,
        margins: 4,
        lastRow: 'justify'
    };
    $('.article-gallery').justifiedGallery(options);
}


$(window).on('load', function() {
   $("#wrapper").fadeTo("slow",1);
});

$(document).ready(function() {
    $(window).on('scroll', function() {
        var topDistance = $(window).scrollTop();

        // Wrapper zoom calculation with boundary checks
        var banner = $(".banner")[0];
        if (banner) {
            var rect = banner.getBoundingClientRect();
            var bottom = rect.bottom;
            var height = rect.height;

            if (height > 0) {
                var z = bottom / height;
                // Clamp z to reasonable bounds and avoid zero/negative
                z = Math.max(0.01, Math.min(2, z));
                $(".wrapper")[0].style.transform = "scale(" + z + ")";
            }
        }

        // Menu visibility logic
        if ($("#menu").length) {
            if ($('#menu').css('visibility') != 'hidden' && topDistance < 10) {
                $("#menu > #nav").show();
            } else if ($('#menu').css('visibility') != 'hidden' && topDistance > 10) {
                $("#menu > #nav").hide();
            }

            if (!$("#menu-icon").is(":visible") && topDistance < 10) {
                $("#menu-icon-tablet").show();
                $("#top-icon-tablet").hide();
            } else if (!$("#menu-icon").is(":visible") && topDistance > 10) {
                $("#menu-icon-tablet").hide();
                $("#top-icon-tablet").show();
            }
        }

        // Footer post visibility
        if ($("#footer-post").length) {
            var lastScrollTop = footerScrollHandler.lastScrollTop || 0;

            if (topDistance > lastScrollTop) {
                $("#footer-post").hide();
            } else {
                $("#footer-post").show();
            }
            footerScrollHandler.lastScrollTop = topDistance;

            $("#nav-footer").hide();
            $("#toc-footer").hide();
            $("#share-footer").hide();

            if (topDistance < 50) {
                $("#actions-footer > ul > #top").hide();
                $("#actions-footer > ul > #menu").show();
            } else if (topDistance > 100) {
                $("#actions-footer > ul > #menu").hide();
                $("#actions-footer > ul > #top").show();
            }
        }
    });

    // Store last scroll position for footer
    var footerScrollHandler = { lastScrollTop: 0 };

    $("#menu-icon, #menu-icon-tablet").click(function() {
        if ($('#menu').css('visibility') == 'hidden') {
            $('#menu').css('visibility', 'visible');
            $('#menu-icon, #menu-icon-tablet').addClass('active');

            var topDistance = $("#menu > #nav").offset().top;

            $("#menu > #nav").show();
            return false;
        } else {
            $('#menu').css('visibility', 'hidden');
            $('#menu-icon, #menu-icon-tablet').removeClass('active');

            return false;
        }
    });

    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    $("#header > #nav > ul > .icon").click(function() {
        $("#header > #nav > ul").toggleClass("responsive");
    });
});
