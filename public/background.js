/* global chrome */
(function() {
    var seedRecordCurrentTab = null

    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.sendMessage(tab.id, { message: 'load' }, (response) => {
        if(!chrome.runtime.lastError && response.result === true){
          chrome.browserAction.setIcon({tabId: tab.id, path: 'favicon_enabled.png'});
        }
      });
    });

    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
      if(request.message){
        if((request.message).startsWith('RE_INJECT_FOREGROUND')){
          executeScript(seedRecordCurrentTab);
        }
      }
    });

    chrome.tabs.onActivated.addListener(tab => {
      chrome.tabs.get(tab.tabId, activeTab => {
        seedRecordCurrentTab = activeTab
        executeScript(activeTab);
      });
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, activeTab) => {
      if (changeInfo.status === "complete" && activeTab.url) {
        seedRecordCurrentTab = activeTab
        executeScript(activeTab);
      }
    });

    const executeScript = (activeTab) => {
      if(/^https:\/\/stake\.com/.test(activeTab?.url || "")){
        chrome.tabs.executeScript(null, {file: './foreground.js'}, () => {console.log('foregound injected')});
      }
    }
}());