import { useState, useEffect } from "react";

export const useCurrencyInput = (value: number | null, onChange: (value: number | null) => void) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setInputValue(formatCurrency(value));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); 

    if (!rawValue) {
      setInputValue("");
      onChange(null);
      return;
    }

    const numberValue = parseInt(rawValue, 10) / 100;
    setInputValue(formatCurrency(numberValue));
    onChange(numberValue);
  };

  return { inputValue, handleInputChange };
};

export const formatCurrency = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "";
  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};