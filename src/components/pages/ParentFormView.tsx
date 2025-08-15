import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, MenuItem, CircularProgress, Box, Button } from "@mui/material";

const debugSleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 都道府県API（ダミー）
const fetchPrefectures = async () => {
  await debugSleep(2000);
  return [
    { code: "tokyo", name: "東京" },
    { code: "osaka", name: "大阪" },
    { code: "fukuoka", name: "福岡" },
  ];
};

// API（ダミー）
const fetchCities = async (prefecture: string): Promise<string[]> => {
  await debugSleep(2000); // 疑似遅延
  const data: Record<string, string[]> = {
    tokyo: ["新宿区", "渋谷区", "港区"],
    osaka: ["北区", "中央区", "西区"],
    fukuoka: ["博多区", "中央区", "南区"],
  };
  return data[prefecture] ?? [];
};

type FormData = {
  prefecture: string;
  city: string;
};

// 初期データ（更新用）
const initialData: FormData = {
  prefecture: "osaka",
  city: "",
};

const fetchInitialData = async () => {
  await debugSleep(1000);
  return initialData;
};

export default function ParentFormView() {
  const [prefectures, setPrefectures] = useState<
    { code: string; name: string }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingPrefectures, setLoadingPrefectures] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const { control, watch, setValue, reset } = useForm<FormData>({
    defaultValues: { prefecture: "", city: "" },
  });

  const selectedPrefecture = watch("prefecture");
  const selectedCity = watch("city");

  // 都道府県取得 → 初期データ取得
  useEffect(() => {
    const loadInitial = async () => {
      const prefData = await fetchPrefectures();
      setPrefectures(prefData);
      setLoadingPrefectures(false);

      const initial = await fetchInitialData();
      reset(initial);
      setLoadingInitial(false);
    };
    loadInitial();
  }, [reset]);

  // 市区町村の取得
  useEffect(() => {
    if (!selectedPrefecture) {
      setCities([]);
      setValue("city", "");
      return;
    }

    setLoadingCities(true);
    fetchCities(selectedPrefecture)
      .then((data) => {
        setCities(data);
        if (!data.includes(watch("city"))) {
          setValue("city", "");
        }
      })
      .finally(() => setLoadingCities(false));
  }, [selectedPrefecture, setValue, watch]);

  if (loadingPrefectures || loadingInitial) {
    return (
      <Box width={300} p={2}>
        <CircularProgress />
      </Box>
    );
  }

  const handleClick = () => {
    console.log("data:", {
      selectedPrefecture,
      selectedCity,
      isPrefecture: !selectedPrefecture,
      isCity: !selectedCity,
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} width={300}>
      {/* 都道府県 */}
      <Controller
        name="prefecture"
        control={control}
        render={({ field }) => (
          <Select {...field} displayEmpty fullWidth>
            <MenuItem value="">都道府県を選択</MenuItem>
            {prefectures.map((p) => (
              <MenuItem key={p.code} value={p.code}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {/* 市区町村 */}
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            displayEmpty
            fullWidth
            disabled={!selectedPrefecture || loadingCities}
          >
            <MenuItem value="">市区町村を選択</MenuItem>
            {loadingCities ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))
            )}
          </Select>
        )}
      />
      <Button onClick={handleClick}>HERE</Button>
    </Box>
  );
}
