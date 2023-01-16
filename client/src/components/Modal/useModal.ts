import { useCallback, useState } from 'react';

export const useModal = (initialState = false) => {
    const [isOpen, toggleModal] = useState(initialState);

    const handleClose = useCallback(() => {
        toggleModal(false);
    }, [toggleModal]);

    const handleOpen = useCallback(() => {
        toggleModal(true);
    }, [toggleModal]);
    return [isOpen, handleOpen, handleClose] as const;
};
