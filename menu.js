const menu_id = chrome.contextMenus.create({
    id: "gmail-inserter-insert-action",
    title: "Insert HTML",
    contexts:["editable"],
    documentUrlPatterns:["*://mail.google.com/mail/*"],
    enabled: false,
    visible: false
});

function handle_click(info, tab) {
    chrome.tabs.sendMessage(tab.id, 
                            "run_insert", 
                            {frameId: info.frameId} )
}

function handle_messages(msg) {
    if(msg == "set_menu_enabled") {
        chrome.contextMenus.update(menu_id, {enabled: true, visible: true});
    } else if(msg = "set_menu_disabled"){
        chrome.contextMenus.update(menu_id, {enabled: false, visible: false});
    }
}

chrome.contextMenus.onClicked.addListener(handle_click);
chrome.runtime.onMessage.addListener(handle_messages);
