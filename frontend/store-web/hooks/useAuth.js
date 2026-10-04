import { useState } from 'react';

export function useAuth() {
  const [user] = useState({ name: "Demo User", role: "merchant" });
  return { user, loading: false };
}
