import {create} from 'zustand';

/**
 * @typedef {{
 *   isCartOpen: boolean;
 *   openCart: () => void;
 *   closeCart: () => void;
 * }} UIStore
 */

export const useUIStore = create((set) => ({
  isCartOpen: false,
  openCart: () => set({isCartOpen: true}),
  closeCart: () => set({isCartOpen: false}),
}));
