window.novel = {}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //alert(request)
   window.novel[request['novel_title']] = request['chapter_count']
})

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'popup.html'})
})