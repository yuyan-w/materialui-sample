import { TextField, TextFieldProps } from "@mui/material";
import { useEffect, useState } from "react";

type DebouncedInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
};

export const DebouncedInput = ({
  value,
  onChange,
  delay = 300,
  ...rest
}: DebouncedInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value); // 外部のvalueが変わったら追従
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(internalValue);
    }, delay);

    return () => clearTimeout(timeout); // 前回のタイマーをクリア
  }, [internalValue, delay, onChange]);

  return (
    <TextField
      {...rest}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
};
