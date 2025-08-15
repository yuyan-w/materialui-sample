import { useQuery } from "react-query";
import { ulid } from "ulid";

type Location = {
  id: string;
  name: string;
};

type Area = {
  id: string;
  name: string;
  locations: Location[];
};

type Region = {
  id: string;
  name: string;
  areas: Area[];
};

type Customer = {
  id: string;
  name: string;
  locationId: string;
};

// データ保持用
let regions: Region[] = [];
let customers: Customer[] = [];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLocations(): Location[] {
  const count = randomInt(1, 5);
  return Array.from({ length: count }, (_, i) => ({
    id: ulid(),
    name: `Location ${i + 1}`,
  }));
}

function generateAreas(): Area[] {
  const count = randomInt(2, 4);
  return Array.from({ length: count }, (_, i) => ({
    id: ulid(),
    name: `Area ${i + 1}`,
    locations: generateLocations(),
  }));
}

function generateRegions(): Region[] {
  const regionCount = 1;
  return Array.from({ length: regionCount }, (_, i) => ({
    id: ulid(),
    name: `Region ${i + 1}`,
    areas: generateAreas(),
  }));
}

function generateCustomersForLocations(allLocations: Location[]): Customer[] {
  const result: Customer[] = [];

  for (const loc of allLocations) {
    const customerCount = randomInt(1, 5);
    for (let i = 0; i < customerCount; i++) {
      result.push({
        id: ulid(),
        name: `Customer ${i + 1} for ${loc.name}`,
        locationId: loc.id,
      });
    }
  }

  return result;
}

// 初期データ生成
async function initializeMockData() {
  regions = generateRegions();
  const allLocations = regions.flatMap((region) =>
    region.areas.flatMap((area) => area.locations)
  );
  customers = generateCustomersForLocations(allLocations);
}

// APIモック：ツリー構造取得
export async function getRegions(): Promise<Region[]> {
  if (regions.length === 0) {
    await initializeMockData();
  }
  // 本物のAPIっぽく遅延
  await new Promise((resolve) => setTimeout(resolve, 200));
  return regions;
}

// APIモック：カスタマー一覧取得
export async function getCustomers(): Promise<Customer[]> {
  if (customers.length === 0) {
    await initializeMockData();
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  return customers;
}

// Region用カスタムフック
export function useRegions() {
  return useQuery("regions", getRegions, {
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ（お好みで）
    retry: 1, // 失敗時に1回だけリトライ
  });
}

// Customer用カスタムフック
export function useCustomers() {
  return useQuery("customers", getCustomers, {
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
