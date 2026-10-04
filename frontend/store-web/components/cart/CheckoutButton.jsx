"use client";

import { useRouter } from "next/navigation";
import styles from "./CheckoutButton.module.css";

export function CheckoutButton({ cart, className }) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <button 
      type="button" 
      className={className || "w-full bg-[#8B5CF6] hover:bg-[#7e53db] text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50"} 
      onClick={handleCheckout}
      disabled={!cart || !cart.items || cart.items.length === 0}
    >
      Proceed to Checkout
    </button>
  );
}
