import { useState, useCallback } from 'react';

/**
 * Generic hook for managing modal/dialog state
 * Useful for exercise modals, forms, confirmation dialogs, etc.
 * 
 * @param {*} initialConfig - Initial configuration for the modal content
 * @returns {Object} - { isOpen, config, open, close, toggle }
 */
export const useModal = (initialConfig = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(initialConfig);

  const open = useCallback((newConfig = null) => {
    if (newConfig !== null) {
      setConfig(newConfig);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Optionally reset config after animation
    // setTimeout(() => setConfig(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const updateConfig = useCallback((updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    isOpen,
    config,
    open,
    close,
    toggle,
    updateConfig,
  };
};

/**
 * Hook for managing multiple named modals
 * Useful when a component has several different modals
 * 
 * @example
 * const modals = useMultiModal(['breathing', 'meditation', 'assessment']);
 * modals.open('breathing', { duration: 5 });
 * modals.isOpen('breathing'); // true
 */
export const useMultiModal = (modalNames = []) => {
  const [openModals, setOpenModals] = useState({});
  const [configs, setConfigs] = useState({});

  const open = useCallback((name, config = null) => {
    setOpenModals((prev) => ({ ...prev, [name]: true }));
    if (config !== null) {
      setConfigs((prev) => ({ ...prev, [name]: config }));
    }
  }, []);

  const close = useCallback((name) => {
    setOpenModals((prev) => ({ ...prev, [name]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setOpenModals({});
  }, []);

  const isOpen = useCallback((name) => !!openModals[name], [openModals]);

  const getConfig = useCallback((name) => configs[name] || null, [configs]);

  const toggle = useCallback((name) => {
    setOpenModals((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return {
    open,
    close,
    closeAll,
    isOpen,
    getConfig,
    toggle,
    openModals,
    configs,
  };
};

export default useModal;
