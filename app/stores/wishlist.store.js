import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({hasHydrated: value}),
      toggle: (product) => {
        const {items} = get();
        const exists = items.some((i) => i.id === product.id);
        set({
          items: exists
            ? items.filter((i) => i.id !== product.id)
            : [...items, product],
        });
      },
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      clear: () => set({items: []}),
    }),
    {
      name: 'wishlist',
      partialize: (state) => ({items: state.items}),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
