var search = false;

function interpretSearch (s) {
    var words = s.split(" ");

    if (!s.includes("@") || words.length < 1)
        return false;
    try {
        var input = "";
        for (var i = 1; i < words.length; i++)
            input += words[i] + " ";

        if (words[0] === "@r") {

            let d = input.replace(/ /g, "").toUpperCase();
            let l = d.split("+");
            let res = new Array(l.length);

            for (let j = 0; j < l.length; j++) {

                let summand = l[j];
                res[j] = {count: "", what: "", sum: 0};

                if (summand.includes("D") || summand.includes("W")) {
                    let h = summand.split("D");
                    if (summand.includes("W"))
                        h = summand.split("W");

                    let res_tmp = new Array(parseInt(h[0]));

                    for (let i = 0; i < res_tmp.length; i++)
                        res_tmp[i] = Math.floor(Math.random() * parseInt(h[1])) + 1;

                    let sum = 0;

                    for (let i = 0; i < res_tmp.length; i++)
                        sum += res_tmp[i];

                    let resString = "";

                    for (let i = 0; i < res_tmp.length; i++)
                        resString += " + " + res_tmp[i];

                    res[j].count = resString.substring(3, resString.length);
                    res[j].sum = sum;
                    res[j].what = summand;
                } else {
                    res[j].count = "";
                    res[j].what = "";
                    res[j].sum = parseInt(summand);
                }

            }

            let localres = {count: "", sum: 0};

            for (let j = 0; j < res.length; j++) {
                localres.count += "<br>" + res[j];
                localres.sum = parseInt(localres.sum) + parseInt(res[j].sum);
            }

            localres.count = localres.count.replace(4, localres.count.length - 1);

            if (!localres.count.includes("NaN") && localres.count.length < 1800) {
                let textline = $("#bci_textline");
                textline.val("");

                let result = $("#bci_innerresultdiv");
                result.css("display", "block");

                for (let j = 0; j < res.length; j++) {
                    let content = $(document.createElement('p'));
                    content.attr("class", "bci");
                    if (res[j].what !== "")
                        content.html(res[j].what + ": " + res[j].count + " = " + res[j].sum);

                    result.append(content);
                }

                let k = "";
                for (let j = 0; j < res.length; j++) {
                    k += " + " + res[j].sum;
                }

                k = k.substr(3, k.length - 1);

                let resultp = $(document.createElement('p'));
                resultp.attr("class", "bci_content");
                resultp.html(k + " = " + localres.sum);

                result.append(resultp);

            }

        } else {
            closeSearch();

            if (words[0] === "@mi")
                shallOpenWindow("https://www.dndbeyond.com/magic-items?filter-search=" + input);

            if (words[0] === "@m0")
                shallOpenWindow("https://www.dndbeyond.com/monsters?filter-search=" + input);

            if (words[0] === "@phb")
                shallOpenWindow("https://www.dndbeyond.com/sources/phb");

            if (words[0] === "@mm")
                shallOpenWindow("https://www.dndbeyond.com/sources/mm");

            if (words[0] === "@dmg")
                shallOpenWindow("https://www.dndbeyond.com/sources/dmg");

            if (words[0] === "@wi")
                shallOpenWindow("https://www.worldanvil.com/w/epurus-caesar0815");

            if (words[0] === "@this")
                redirectTo("https://www.dndbeyond.com/search?q=" + input);
        }

        return true;
    } catch (e) {
        console.log(e);
    }

    return false;
}


function shallOpenWindow (v) {
    chrome.runtime.sendMessage({action: "checkForOpenTab", data: v})
}

function openWindow (v) {
    var win = window.open(v, "_blank");

    if (win)
        win.focus();
    else
        alert("Please allow popups for this site. ");
}

function redirectTo (v) {
    window.location.replace(v);
}

function closeSearch () {
    $("bci_searchdiv").val("");
    search = false;
    reverseSearch();
}

function initSearch () {
    var searchdiv = $(document.createElement('div'));
    searchdiv.attr("id", "bci_searchdiv");
    searchdiv.attr("class", "bci");

    var innersearchdiv = $(document.createElement('div'));
    innersearchdiv.attr("id", "bci_innersearchdiv");
    innersearchdiv.attr("class", "bci");

    var textline = $(document.createElement('input'));
    textline.attr("placeholder", "Search for...");
    textline.attr("id", "bci_textline");
    textline.attr("class", "bci");

    var result = $(document.createElement('div'));
    result.attr("id", "bci_innerresultdiv");
    result.attr("class", "bci");

    searchdiv.keydown(function (e) {
        if(e.key === "Escape")
            closeSearch();
    });

    searchdiv.click(function (e) {
        closeSearch();
    })

    textline.keypress(function (e) {
        if (e.which === 13) {
            var input = textline.val();

            if (!interpretSearch(input)) {
                closeSearch();
                shallOpenWindow("https://www.dndbeyond.com/search?q=" + input)
            }
        }
    });

    textline.click(function (e) {
        e.stopPropagation();
    })

    textline.focusout(function () {
        textline.focus();
    });

    innersearchdiv.append(textline);
    innersearchdiv.append(result);
    searchdiv.append(innersearchdiv);
    searchdiv.insertAfter($("body"));
}

function viewSearch () {
    var searchdiv = $("#bci_searchdiv");
    searchdiv.show();
    searchdiv.css("display", "block");
    var input = $("#bci_textline");
    input.focus();

    var targetOffset = $("body").offset().top;
    $('html,body').animate({scrollTop: targetOffset}, 1000);

}

function reverseSearch () {
    var searchdiv = $("#bci_searchdiv");
    searchdiv.hide();
    searchdiv.css("display", "none");

    var input = $("#bci_textline");
    input.val("");

    var result = $("#bci_innerresultdiv");
    result.css("display", "none");
    result.empty();
}

async function updateSearch () {
    if (search)
        viewSearch();
    else
        reverseSearch();
}


initSearch();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "open") {
        closeSearch()
        openWindow(request.data);
    }

    if (request.action === "search")
        search = !search;
    updateSearch();
    return;
});