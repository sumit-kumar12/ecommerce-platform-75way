import { create } from 'zustand';

export const useCheckoutStore = create((set) => ({
  shippingAddress: {
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  deliveryDate: '',
  deliveryTimeSlot: '',
  shippingMethod: 'standard', // 'standard', 'express', 'sameday'
  paymentMethod: 'UPI',

  setShippingAddress: (address) => set((state) => ({ 
    shippingAddress: { ...state.shippingAddress, ...address } 
  })),
  setDeliveryOptions: (options) => set((state) => ({ ...state, ...options })),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({
    shippingAddress: {
      fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '',
    },
    deliveryDate: '',
    deliveryTimeSlot: '',
    shippingMethod: 'standard',
    paymentMethod: 'UPI',
  })
}));
