/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 
  | 'pricing-pro' 
  | 'pricing-ultra' 
  | 'payment-success' 
  | 'payment-failed' 
  | 'payment-canceled'
  | 'payment-verification-failed'
  | 'order-failed'
  | 'limit-reached' 
  | 'auth-required' 
  | 'logout-confirm'
  | 'subscription-updated'
  | 'delete-confirm'
  | 'welcome-new'
  | 'generic-success' 
  | 'generic-error';

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  title?: string;
  message?: string;
  onConfirm?: () => void;
}

interface ModalContextType {
  openModal: (type: ModalType, config?: { title?: string; message?: string; onConfirm?: () => void }) => void;
  closeModal: () => void;
  modalState: ModalState;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
  });

  const openModal = (type: ModalType, config?: { title?: string; message?: string; onConfirm?: () => void }) => {
    setModalState({
      isOpen: true,
      type,
      ...config,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalState }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};
