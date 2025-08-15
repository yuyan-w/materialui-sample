import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sumpleFunction } from "../Modal/SampleModal.tsx";

// ------------------------
// sleep 関数と API モック
// ------------------------
const sleep = async () => {
  const delay = Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

type OptionItem = {
  label: string;
  value: string;
};

const fetchOptions = async (): Promise<OptionItem[]> => {
  await sleep();

  return [
    { label: "寝室", value: "bedroom" },
    { label: "リビング", value: "living" },
    { label: "キッチン", value: "kitchen" },
  ];
};

// ------------------------
// スキーマ定義
// ------------------------
const schema = z.object({
  room: z.string().min(1, "部屋を選択してください"),
});

type FormData = z.infer<typeof schema>;

// ------------------------
// コンポーネント
// ------------------------
const RHFPage = () => {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      room: "",
    },
  });

  // 初期値取得関数（編集時）
  const fetchData = async (): Promise<string> => {
    await sleep();
    return "bedroom";
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 選択肢と初期値を並列に取得
      const [opts, defaultRoom] = await Promise.all([
        fetchOptions(),
        fetchData(),
      ]);

      setOptions(opts);
      reset({ room: defaultRoom }); // 初期値をセット
      setLoading(false);
    };

    load();
  }, [reset]);

  const onSubmit = (data: FormData) => {
    console.log("送信データ:", data);
    alert(`選択された部屋: ${data.room}`);
  };

  const str = sumpleFunction();

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          部屋選択フォーム
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth margin="normal" error={!!errors.room}>
            <InputLabel id="room-label">部屋</InputLabel>

            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="room-label"
                  label="部屋"
                  value={field.value || ""}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <FormHelperText>{errors.room?.message}</FormHelperText>
          </FormControl>

          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              送信
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RHFPage;
