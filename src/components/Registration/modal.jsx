import React, { createContext, useState, useContext, useCallback } from 'react';
import './modal.css';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  
  const openModal = useCallback((content) => {
    setModalContent(content);
    setIsModalOpen(true);
  },[]);

  const closeModal = useCallback(() => {
    setModalContent(null);
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalContent, openModal, closeModal }}
    >
      {children}
      {isModalOpen && (
        <>
          <div className="modal-backdrop fade show blur-background"></div>
          <div className="modal fade show custom-modal">
            <div className="custom-dialog" role="document">
              <div className="m-content">
                <div className="modal-body">{modalContent}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
