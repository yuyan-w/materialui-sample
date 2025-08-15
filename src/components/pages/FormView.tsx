import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from "@mui/material";
import { useRegions } from "../../hooks/generateItems"; // useRegions を使う
import { useEffect, useMemo } from "react";

const AppRole = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EDITOR: "Editor",
} as const;

type AppRoleType = (typeof AppRole)[keyof typeof AppRole];

const TargetType = {
  REGION: "region",
  AREA: "area",
  LOCATION: "location",
} as const;

type TargetType = (typeof TargetType)[keyof typeof TargetType];

const UlidSchema = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/i, "無効なULIDです")
  .or(z.literal("")); // 空文字許容

// スキーマ定義
const schema = z.object({
  name: z.string(),
  role: z.nativeEnum(AppRole), // ここで型安全にenum定義を利用
  locationId: z.string().optional(),
  locationIds: z.array(z.string()),

  targetType: z.nativeEnum(TargetType),
  targetId: z.string(),
});

// TypeScript用型
type FormData = z.infer<typeof schema>;

const FormView = () => {
  const { data: regions = [], isLoading } = useRegions();
  // 全ロケーションをフラットに整形
  const allLocations = useMemo(() => {
    return regions.flatMap((region) =>
      region.areas.flatMap((area) => area.locations)
    );
  }, [regions]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: AppRole.ADMIN,
      locationId: "",
      locationIds: [],
      targetType: TargetType.REGION,
      targetId: "",
    },
  });

  useEffect(() => {
    console.log("useeffect run");
    if (allLocations.length > 0) {
      reset({
        name: "",
        role: AppRole.ADMIN,
        locationId: "",
        locationIds: [],
      });
    }
  }, [reset, allLocations]);

  const targetType = useWatch({ control, name: "targetType" });

  // 対象ID一覧を動的に切り替える
  const targetOptions = useMemo(() => {
    if (targetType === TargetType.REGION) {
      return regions.map((region) => ({ id: region.id, name: region.name }));
    }
    if (targetType === TargetType.AREA) {
      return regions.flatMap((region) =>
        region.areas.map((area) => ({ id: area.id, name: area.name }))
      );
    }
    if (targetType === TargetType.LOCATION) {
      return regions.flatMap((region) =>
        region.areas.flatMap((area) =>
          area.locations.map((loc) => ({ id: loc.id, name: loc.name }))
        )
      );
    }
    return [];
  }, [targetType, regions]);

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      locationId: data.locationId === "" ? undefined : data.locationId,
    };
    console.log("送信データ", payload);
    reset();
  };

  if (regions.length === 0) {
    return <div>loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        ユーザーフォーム
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="名前"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="normal"
        />

        {/* ロール選択追加部分 */}
        <FormControl fullWidth error={!!errors.role} margin="normal">
          <InputLabel id="role-label">ロール</InputLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                labelId="role-label"
                label="ロール"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("locationId", "");
                }}
              >
                {Object.values(AppRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.role?.message}</FormHelperText>
        </FormControl>

        {/* Location選択 */}
        <FormControl fullWidth error={!!errors.locationId} margin="normal">
          <InputLabel id="location-label">ロケーション</InputLabel>
          <Controller
            name="locationId"
            control={control}
            render={({ field }) => (
              <Select labelId="location-label" label="ロケーション" {...field}>
                {allLocations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.locationId?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!errors.locationIds} margin="normal">
          <InputLabel id="location-label">ロケーション</InputLabel>
          <Controller
            name="locationIds"
            control={control}
            render={({ field }) => (
              <Select
                labelId="location-label"
                label="ロケーション"
                multiple
                value={field.value}
                onChange={field.onChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((id) => {
                      const loc = allLocations.find((l) => l.id === id);
                      return (
                        <Chip
                          key={id}
                          label={loc?.name || id}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                          onDelete={(e) => {
                            console.log("onDelete");
                            e.stopPropagation(); // ← これが大事！
                            // 選択解除ロジック
                            const newValue = (selected as string[]).filter(
                              (v) => v !== id
                            );
                            field.onChange(newValue);
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {allLocations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.locationIds?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>対象タイプ</InputLabel>
          <Controller
            name="targetType"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <MenuItem value={TargetType.REGION}>リージョン</MenuItem>
                <MenuItem value={TargetType.AREA}>エリア</MenuItem>
                <MenuItem value={TargetType.LOCATION}>ロケーション</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>対象ID</InputLabel>
          <Controller
            name="targetId"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                {targetOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          送信
        </Button>
      </form>
    </Box>
  );
};

export default FormView;
