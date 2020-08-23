var v = true;

chrome.storage.local.get("active", function(items) {
    v = items.active;
});

function init () {
    var body = $("body");
    var background = body.css("background").replace("230px", "115px");

    if ($('#content').height() < $(window).height())
        body.css("overflow-y", "hidden");

    if (background.includes("115px"))
        body.css("background", background);

    var top = $("#mega-menu-target, .site-bar");

    var sidebar = $(".ct-sidebar");
    sidebar[0].style.setProperty('top', '0px', 'important');


    /*setTimeout(function(){
        top.css("display", "none");
        top.css("top", "0px");
    }, 1000);

    top.css("top", top.offsetHeight);*/

    top.css("display", "none");

    //$("ct-sidebar")[0].css("top", "70px");
    //$("ct-sidebar")[0].css("height", "900px");
}

function reverse () {
    var body = $("body");
    var background = body.css("background").replace("115px", "230px");
    body.css("background", background);
    body.css("overflow-y", "visible");

    $("#mega-menu-target").css("display", "block");
    $(".site-bar").css("display", "block");
    //$("ct-sidebar")[0].css("top", "70px");
    //$("ct-sidebar")[0].css("height", "900px");
}

function update () {
    if (v)
        init();
    else
        reverse();
}

$(document).ready(function () {
   $("body").bind("DOMSubtreeModified", function() {
        update()
   });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "changed") {
        v = !v;
        update();
    }
    return;
});