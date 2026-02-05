import React from 'react';
import { useModals } from '@/hooks/use-modals';
import { FeedbackModal } from '@/components/modals/FeedbackModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { EditPhotoModal } from '@/components/profile/EditPhotoModal';
import { ProPlanModal } from '@/components/modals/ProPlanModal';
import { UltraPlanModal } from '@/components/modals/UltraPlanModal';

export const ModalContainer = () => {
  const { modalState, closeModal } = useModals();

  const isUpgradePlan = modalState.type === 'pricing-pro' || modalState.type === 'pricing-ultra';

  return (
    <>
      <FeedbackModal
        isOpen={modalState.isOpen && !isUpgradePlan && modalState.type !== 'edit-profile' && modalState.type !== 'edit-photo'}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
      />
      {modalState.isOpen && modalState.type === 'pricing-pro' && (
        <ProPlanModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
          }}
        />
      )}
      {modalState.isOpen && modalState.type === 'pricing-ultra' && (
        <UltraPlanModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            // Optional: Show success feedback after upgrade
          }}
        />
      )}
      <EditProfileModal
        isOpen={modalState.isOpen && modalState.type === 'edit-profile'}
        onClose={closeModal}
      />
      <EditPhotoModal
        isOpen={modalState.isOpen && modalState.type === 'edit-photo'}
        onClose={closeModal}
      />
    </>
  );
};
