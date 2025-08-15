import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Container,
} from "@mui/material";
import { useQuery } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const debugSleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type FormValues = {
  parentId: string;
  childId: string;
};

const initialData = {
  tenant: {
    tenantId: "tenant-1",
  },
  location: {
    locationId: "location-1",
  },
};

type Tenant = {
  tenantId: string;
  tenantName: string;
};

const tenants = [
  { tenantId: "tenant-1", tenantName: "sample-1" },
  { tenantId: "tenant-2", tenantName: "sample-2" },
];

type Location = {
  locationId: string;
  locationName: string;
};

const locations: Record<string, Location[]> = {
  "tenant-1": [
    { locationId: "location-1", locationName: "location-1-n" },
    { locationId: "location-2", locationName: "location-2-n" },
  ],
  "tenant-2": [
    { locationId: "location-3", locationName: "location-3-n" },
    { locationId: "location-4", locationName: "location-4-n" },
  ],
};

// API 呼び出し関数
const fetchInitialData = async () => {
  await debugSleep(500);
  return initialData;
};

const fetchTenants = async (): Promise<Tenant[]> => {
  await debugSleep(800);
  return tenants;
};

const fetchLocations = async (tenantId: string) => {
  await debugSleep(800);
  const fetched = locations[tenantId];
  return fetched;
};

const useInitialQuery = () => {
  return useQuery("initialData", fetchInitialData);
};

const useTenants = () => {
  return useQuery("tenants", fetchTenants);
};

const useLocations = (tenantId: string) => {
  return useQuery(["location", tenantId], () => fetchLocations(tenantId));
};

const schema = z.object({
  tenantId: z.string(),
  locationId: z.string(),
});

type Input = z.infer<typeof schema>;

export default function FormComponent() {
  // 初期フォームデータ
  const { data: initialData } = useInitialQuery();

  const onSubmit = async (input: Input) => {
    await debugSleep(3000);
    console.log("onSubmit:", { input });
  };

  const { control, handleSubmit, watch, setValue, reset } = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: "",
      locationId: "",
    },
  });

  // 親セレクトの選択肢
  const { data: tenantOptions = [] } = useTenants();

  // 親の現在の値を監視
  const selectedParentId = watch("tenantId");

  // 子セレクトの選択肢
  const { data: locationOptions = [], isFetching: loadingChildren } =
    useLocations(selectedParentId);

  // parentId が変わったら childId をリセット
  useEffect(() => {
    if (selectedParentId) {
      setValue("locationId", ""); // 子セレクトのリセット
    }
  }, [selectedParentId, setValue]);

  // テナントID
  useEffect(() => {
    if (initialData && tenantOptions.length > 0) {
      const exists = tenantOptions.some(
        (tenant) => tenant.tenantId === initialData.tenant.tenantId
      );

      if (exists) {
        setValue("tenantId", initialData.tenant.tenantId);
      }
    }
  }, [initialData, tenantOptions, setValue]);

  useEffect(() => {
    if (
      initialData &&
      initialData.tenant.tenantId === selectedParentId && // 連動チェック
      locationOptions.length > 0
    ) {
      const exists = locationOptions.some(
        (location) => location.locationId === initialData.location.locationId
      );

      if (exists) {
        setValue("locationId", initialData.location.locationId);
      }
    }
  }, [initialData, selectedParentId, locationOptions, setValue]);

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-label">親カテゴリ</InputLabel>
          <Controller
            control={control}
            name="tenantId"
            render={({ field }) => (
              <Select
                {...field}
                labelId="parent-label"
                label="親カテゴリ"
                onChange={(e) => {
                  setValue("locationId", "");
                  field.onChange(e);
                }}
              >
                {tenantOptions.map((tenant) => (
                  <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.tenantName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={loadingChildren}>
          <InputLabel id="child-label">子カテゴリ</InputLabel>
          <Controller
            control={control}
            name="locationId"
            render={({ field }) => (
              <Select {...field} labelId="child-label" label="子カテゴリ">
                {locationOptions.map((location) => (
                  <MenuItem
                    key={location.locationId}
                    value={location.locationId}
                  >
                    {location.locationName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Button variant="contained" color="primary" type="submit">
          送信
        </Button>
      </form>
    </Container>
  );
}
