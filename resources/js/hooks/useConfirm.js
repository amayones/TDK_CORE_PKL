import { useContext } from 'react';
import ConfirmModal from '../core/ConfirmModal';

// We need to access the confirm method from ConfirmModal component
// This hook provides a way to trigger confirmation dialogs

export function useConfirm() {
    // The confirm function is exported from ConfirmModal
    // This hook can be used to access it if needed
    return {
        confirm: ConfirmModal.confirm || (() => Promise.resolve(false)),
    };
}

// Helper function for quick confirmation
export async function confirmAction(options) {
    if (typeof ConfirmModal.confirm === 'function') {
        return await ConfirmModal.confirm(options);
    }
    // Fallback: always confirm if confirm function is not available
    return true;
}