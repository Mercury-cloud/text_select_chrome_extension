  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'developer.chrome.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.method.toLowerCase()==="getoptions") {
        chrome.storage.sync.get(request.keys, function (res) {
            sendResponse(res);
        })
    }

    if(request.method.toLowerCase()==="setoptions") {
        console.log("Setting options", request.data);
        chrome.storage.sync.set(request.data, sendResponse);
    }

    return true;
});