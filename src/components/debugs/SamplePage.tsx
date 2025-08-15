import { useEffect, useState } from "react";
import MockLayout from "../layout/MockLayout";
import { TextField } from "@mui/material";

/**
 * デバウンス用フック
 */
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export const SamplePage = () => {
  const [value, setValue] = useState("");

  const debouncedValue = useDebouncedValue(value, 3000);

  useEffect(() => {
    console.log(`run: ${debouncedValue}`);
  }, [debouncedValue]);

  return (
    <MockLayout>
      <div>
        <p>{`value: ${value}`}</p>
        <p>{`debouncedValue: ${debouncedValue}`}</p>
      </div>
      <TextField value={value} onChange={(e) => setValue(e.target.value)} />
    </MockLayout>
  );
};
