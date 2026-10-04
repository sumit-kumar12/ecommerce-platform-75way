"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export function useStoreCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest("/products/categories/tree", { csrf: false });

        if (!active) {
          return;
        }

        setCategories(Array.isArray(response?.categories) ? response.categories : []);
      } catch {
        if (!active) {
          return;
        }

        setCategories([]);
        setError("Category data is currently unavailable.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
