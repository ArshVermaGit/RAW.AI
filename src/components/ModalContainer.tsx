import React from 'react';
import { useModals } from '@/hooks/use-modals';
import { FeedbackModal } from '@/components/FeedbackModal';
import { UpgradeModal } from '@/components/UpgradeModal';

export const ModalContainer = () => {
  const { modalState, closeModal } = useModals();

  const isUpgradePlan = modalState.type === 'pricing-pro' || modalState.type === 'pricing-ultra';
  
  return (
    <>
      <FeedbackModal
        isOpen={modalState.isOpen && !isUpgradePlan}
        onClose={closeModal}
        type={modalState.type as 'login-success' | 'login-error' | 'signup-success' | 'forgot-sent' | 'reset-success' | 'payment-success' | 'payment-failed' | 'limit-reached' | 'auth-required' | 'generic-success' | 'generic-error'}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
      />
      {modalState.isOpen && isUpgradePlan && (
        <UpgradeModal
          isOpen={true}
          onClose={closeModal}
          plan={modalState.type === 'pricing-pro' ? 'pro' : 'ultra'}
          onSuccess={() => {
            closeModal();
            // Optional: Show success feedback after upgrade
          }}
        />
      )}
    </>
  );
};
