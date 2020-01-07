function update () {
    chrome.storage.local.get("active", function(items) {
        var active = items.active;

        if (active)
            chrome.browserAction.setIcon({path: "icons/icon_inverted.png"});
        else
            chrome.browserAction.setIcon({path: "icons/icon.png"});

        chrome.storage.local.set({ "active": !active });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "changed"});
        });
    });
}

function sendOpenSearchMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "search"});
    });
}

chrome.commands.onCommand.addListener(function(command) {
    if (command === "toggle-actived")
        update();
    if (command === "open-search")
        sendOpenSearchMessage();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "checkForOpenTab") {
        chrome.tabs.query({currentWindow: true}, function(tabs){
            var v = true;
            for (var i = 0; i < tabs.length; i++) {
                if(tabs[i].url === request.data) {
                    v = false;
                    chrome.tabs.update(tabs[i].id, {highlighted: true});
                    break;
                }
            }
            if (v) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {action: "open", data: request.data});
                });
            }
        });
    }
    return;
});

chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.set({ "active": true });
});