import React, { createContext, useEffect, useState } from 'react';
import useWindowPosition from '../Hooks/useWindowPosition';
import { EXTENSION_ID_RESULT, GET_EXTENSION_ID, TOGGLE_POPUP_VIEW } from '../Constants'

export const ModalContext = createContext({});

const ModalProvider = ({ children }) => {
  const { windowPosition } = useWindowPosition();
  const [extensionId, setExtensionId] = useState(undefined);
  const [disableDrag, setDisableDrag] = useState(true);
  const [hideView, setHideView] = useState(false);

  function getExtensionId() {
    window.postMessage({ type: GET_EXTENSION_ID }, "*");
  }

  function setDisable(bool){
    setDisableDrag(bool)
  }

  useEffect(() => {
    // Set up event listeners from Content script
    window.addEventListener("message", function(event) {
      if (event.source !== window) return;
      if(event.data.type !== undefined){
        switch(event.data.type){
          case EXTENSION_ID_RESULT:
              setExtensionId(event.data.extensionId);
            break;
          case TOGGLE_POPUP_VIEW:
              setHideView(event.data.value)
            break;
          default:
            break;
        }
      }
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        extensionId,
        getExtensionId,
        windowPosition,
        disableDrag,
        setDisable,
        hideView
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
