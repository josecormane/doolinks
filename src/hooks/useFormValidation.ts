"use client";

import { useState } from "react";

import { isValidQuotationUrl } from "@/lib/validators/url-validator";

export function useFormValidation() {
  const [errors, setErrors] = useState(["", "", ""]);

  function validateUrls(urls: string[]) {
    const nextErrors = ["", "", ""];
    let valid = true;

    urls.forEach((value, idx) => {
      if (!value.trim()) {
        nextErrors[idx] = "Este campo es requerido.";
        valid = false;
        return;
      }
      if (!isValidQuotationUrl(value)) {
        nextErrors[idx] = "La URL es inválida o no coincide con el patrón esperado de Odoo.";
        valid = false;
      }
    });

    setErrors(nextErrors);
    return valid;
  }

  function clearError(index: number) {
    setErrors((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  }

  return { errors, setErrors, validateUrls, clearError };
}

