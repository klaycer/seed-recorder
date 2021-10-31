/* global chrome */
const seedRecorderRandId = Date.now() + '_' + Math.random().toString(5);
const seedRecorderHidePopup = 'seedRecorderHidePopup_'+seedRecorderRandId

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  main(callback);
});

function main(callback) {
  // eslint-disable-next-line no-undef
  const extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
  // eslint-disable-next-line no-restricted-globals
  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // Fetch the local React index.html page
    // eslint-disable-next-line no-undef
    if($('#seed-recorder-window').length){
      window.postMessage({ type: "TOGGLE_POPUP_VIEW", value: getToggleView() }, "*");
    }
    else{
      callback({result: true})
      fetch(chrome.runtime.getURL('index.html') /*, options */)
      .then((response) => response.text())
      .then((html) => {
        const styleStashHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
        // eslint-disable-next-line no-undef
        $(styleStashHTML).appendTo('body');
      })
      .catch((error) => {
        console.warn(error);
      });
    }
  }
}

function getToggleView(){
  let value = !(localStorage.getItem(seedRecorderHidePopup) || false);
  if(value === true){
    localStorage.setItem(seedRecorderHidePopup, true)
  }
  else{
    localStorage.removeItem(seedRecorderHidePopup)
  }
  return value
}

window.addEventListener("message", function(event) {
  if(event.data.type){
    if((event.data.type).startsWith('RE_INJECT_FOREGROUND')){
      chrome.runtime.sendMessage({ message: event.data.type })
    }
  }
  else if (event.source !== window) return;
  onDidReceiveMessage(event);
});

async function onDidReceiveMessage(event) {
  if (event.data.type){
    if(event.data.type === "GET_EXTENSION_ID") {
      window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
    }
  }
}


(function() {
       
var divHandlerIdCon = '_SeedRecorderScriptIdCon';

var scriptExistsCon = document.getElementById(divHandlerIdCon);

if(scriptExistsCon == null){
    var script = document.createElement("script");
    var scriptLoadedElement = document.createElement("div");
    scriptLoadedElement.id = divHandlerIdCon;
    scriptLoadedElement.innerHTML = '<h1 style="display:none;">'+divHandlerIdCon+'</h1>';
    document.body.appendChild(scriptLoadedElement);
    script.innerHTML = `
    const WebSocketProxy = new Proxy(window.WebSocket, {
        construct(target, args) {
          console.log("Proxying WebSocket connection", ...args);
          const ws = new target(...args);
          
          // Configurable hooks
          ws.hooks = {
            beforeSend: () => null,
            beforeReceive: () => null
          };
      
          // Intercept send
          const sendProxy = new Proxy(ws.send, {
            apply(target, thisArg, args) {
              if (ws.hooks.beforeSend(args) === false) {
                return;
              }
              return target.apply(thisArg, args);
            }
          });
          ws.send = sendProxy;
      
          // Intercept events
          const addEventListenerProxy = new Proxy(ws.addEventListener, {
            apply(target, thisArg, args) {
              if (args[0] === "message" && ws.hooks.beforeReceive(args) === false) {
                return;
              }
              return target.apply(thisArg, args);
            }
          });
          ws.addEventListener = addEventListenerProxy;
      
          Object.defineProperty(ws, "onmessage", {
            set(func) {
              const onmessage = function onMessageProxy(event) {
                if (ws.hooks.beforeReceive(event) === false) {
                  return;
                }
                func.call(this, event);
              };
              return addEventListenerProxy.apply(this, [
                "message",
                onmessage,
                false
              ]);
            }
          });
      
          // Save reference
          window._websockets = window._websockets || [];
          window._websockets.push(ws);

          window.postMessage({type: "RE_INJECT_FOREGROUND"}, '*');
          
          return ws;
        }
    });
      
    window.WebSocket = WebSocketProxy;
    `;
    document.body.appendChild(script);
}
}());
