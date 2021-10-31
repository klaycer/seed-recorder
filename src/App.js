import React from 'react';
import './App.css';
import Modal from './Components/Modal';
import ModalProvider from './Contexts/ModalProvider';
import RecorderProvider from './Contexts/RecorderProvider';
import { DBConfig } from './Model/Index';
import { initDB } from 'react-indexed-db';

initDB(DBConfig);

/**
 * @return {null}
 */
function App() {
  return (
    <RecorderProvider>
      <ModalProvider>
        <Modal />
      </ModalProvider>
    </RecorderProvider>
  );
}

export default App;
