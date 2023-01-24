function is_message_body(node) {
    let element = (node instanceof Element) ? node : node.parentElement;
    while(element && element.ariaLabel != "Message Body"){
        element = element.parentElement;
    }
    return element != null;
}

function remove_scripts(element) {
    for(let e of element.querySelectorAll("script")) {
        e.remove();
    }
    return element;
}

function do_insert(msg) {
    if(msg != "run_insert")
        return;
    if(window.getSelection().rangeCount > 0) {
        let selection = window.getSelection().getRangeAt(0);
        if(is_message_body(selection.commonAncestorContainer)) {
            navigator.clipboard.readText().then(
                (text) => {
                    let tmp = document.createElement("template");
                    tmp.innerHTML = text;    
                    selection.deleteContents();
                    selection.insertNode(remove_scripts(tmp.content));
                    selection.collapse();                
                },
                (failure_cause) => {
                    console.log("html-inserter: couldn't read from clipboard", failure_cause);
                }
            )
        } else {
            console.log("html-inserter: can only insert into message body")
        }
    } else {
        console.log("html-inserter: no selection")
    }
}

function set_menu_state(ev) {
    if (is_message_body(ev.target)) {
        chrome.runtime.sendMessage("set_menu_enabled");
    } else {
        chrome.runtime.sendMessage("set_menu_disabled");
    }
}

document.addEventListener("contextmenu",  set_menu_state);
chrome.runtime.onMessage.addListener( do_insert );