// 注意点。Select内に

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  ListSubheader,
  Avatar,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

type Fruit = {
  id: string;
  label: string;
  info: string;
};

// ダミーデータ
const fruits = [
  { id: "ap", label: "Apple", info: "甘め・定番" },
  { id: "ba", label: "Banana", info: "エネルギー補給" },
  { id: "or", label: "Orange", info: "ビタミンC" },
  { id: "gr", label: "Grapes", info: "小粒で食べやすい" },
  { id: "ki", label: "Kiwi", info: "酸味あり" },
];

const groupedOptions = [
  { group: "Citrus", items: ["Orange", "Lemon", "Lime"] },
  { group: "Berries", items: ["Strawberry", "Blueberry", "Raspberry"] },
];

const withIcons = [
  { value: "chrome", label: "Chrome", emoji: "🌐" },
  { value: "safari", label: "Safari", emoji: "🧭" },
  { value: "firefox", label: "Firefox", emoji: "🦊" },
  { value: "edge", label: "Edge", emoji: "🧩" },
];

export const SelectDemoPage = () => {
  // 1) 基本 + プレースホルダー
  const [basic, setBasic] = React.useState("");

  // 2) 複数選択 + チップ表示
  const [multi, setMulti] = React.useState<string[]>([]);

  // 3) ネイティブ
  const [native, setNative] = React.useState("");

  // 4) グルーピング
  const [groupVal, setGroupVal] = React.useState("");

  // 5) カスタムレンダリング（アイコン付き）
  const [iconVal, setIconVal] = React.useState("chrome");

  // 6) 開閉の制御 + disablePortal 切替
  const [controlledOpen, setControlledOpen] = React.useState(false);
  const [controlledVal, setControlledVal] = React.useState("or");
  const [disablePortal, setDisablePortal] = React.useState(false);

  // 7) 非同期ロード（疑似）
  const [asyncOpts, setAsyncOpts] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [asyncVal, setAsyncVal] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const loadAsync = () => {
    setLoading(true);
    setTimeout(() => {
      setAsyncOpts([
        { value: "tokyo", label: "Tokyo" },
        { value: "osaka", label: "Osaka" },
        { value: "nagoya", label: "Nagoya" },
      ]);
      setLoading(false);
    }, 600);
  };

  React.useEffect(() => {
    loadAsync();
  }, []);

  // 8) 検索できる選択肢（Autocomplete）
  const [autoVal, setAutoVal] = React.useState<Fruit | null>(null);

  return (
    <Box
      sx={{
        p: 3,
        display: "grid",
        gap: 2,
        gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
      }}
    >
      <Card>
        <CardHeader
          title="1) 基本のSelect＋プレースホルダー"
          subheader="displayEmpty と renderValue で未選択時の表示を制御"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="basic-label">フルーツ</InputLabel>
            <Select
              labelId="basic-label"
              value={basic}
              label="フルーツ"
              onChange={(e) => setBasic(e.target.value)}
              displayEmpty
              input={<OutlinedInput label="フルーツ" />}
              renderValue={(selected) => {
                if (!selected)
                  return (
                    <Typography color="text.secondary">
                      未選択（プレースホルダー）
                    </Typography>
                  );
                const f = fruits.find((x) => x.id === selected);
                return f?.label ?? selected;
              }}
              MenuProps={{
                PaperProps: { sx: { maxHeight: 280 } },
              }}
            >
              <MenuItem value="">
                <em>未選択</em>
              </MenuItem>
              {fruits.map((f) => (
                <MenuItem key={f.id} value={f.id} sx={{ gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>{f.label[0]}</Avatar>
                  <Box>
                    <Typography>{f.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.info}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">選択値: {basic || "(未選択)"}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="2) 複数選択（チェックボックス＋チップ表示）"
          subheader="multiple + renderValue で選択肢をチップ表示"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="multi-label">複数選択</InputLabel>
            <Select
              labelId="multi-label"
              multiple
              value={multi}
              onChange={(e) =>
                setMulti(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                )
              }
              input={<OutlinedInput label="複数選択" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((val) => {
                    const f = fruits.find((x) => x.id === val);
                    return (
                      <Chip key={val} size="small" label={f?.label ?? val} />
                    );
                  })}
                </Box>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {fruits.map((f) => (
                <MenuItem key={f.id} value={f.id} sx={{ py: 0.6 }}>
                  <Checkbox checked={multi.indexOf(f.id) > -1} />
                  <ListItemText primary={f.label} secondary={f.info} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            選択値: {multi.length ? multi.join(", ") : "(未選択)"}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="3) ネイティブSelect"
          subheader="ブラウザ標準のドロップダウン（シンプル・軽量）"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor="native-select">ネイティブ</InputLabel>
            <Select
              native
              label="ネイティブ"
              inputProps={{ id: "native-select" }}
              value={native}
              onChange={(e) => setNative(e.target.value)}
            >
              <option aria-label="None" value="" />
              {fruits.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            選択値: {native || "(未選択)"}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="4) オプショングルーピング"
          subheader="ListSubheader を使ってカテゴリ毎に見出しを表示"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="group-label">グループ</InputLabel>
            <Select
              labelId="group-label"
              value={groupVal}
              label="グループ"
              onChange={(e) => setGroupVal(e.target.value)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              {groupedOptions.map((g) => [
                <ListSubheader disableSticky key={`${g.group}-sub`}>
                  {g.group}
                </ListSubheader>,
                ...g.items.map((item) => (
                  <MenuItem key={`${g.group}-${item}`} value={item}>
                    {item}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            選択値: {groupVal || "(未選択)"}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="5) アイコン（絵文字）付きオプション"
          subheader="MenuItem の中で好きなレイアウトを構築"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="icon-label">ブラウザ</InputLabel>
            <Select
              labelId="icon-label"
              value={iconVal}
              label="ブラウザ"
              onChange={(e) => setIconVal(e.target.value)}
              renderValue={(v) => {
                const found = withIcons.find((x) => x.value === v);
                return found ? `${found.emoji} ${found.label}` : v;
              }}
            >
              {withIcons.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ gap: 1 }}>
                  <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                  <Typography>{opt.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">選択値: {iconVal}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="6) 開閉を制御 + disablePortal 切替"
          subheader="開く/閉じるをボタンで制御。モーダル内検証用に disablePortal をトグル"
        />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => setControlledOpen(true)}>
              開く
            </Button>
            <Button variant="outlined" onClick={() => setControlledOpen(false)}>
              閉じる
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={disablePortal}
                  onChange={(e) => setDisablePortal(e.target.checked)}
                />
              }
              label="disablePortal"
            />
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="controlled-label">制御Select</InputLabel>
            <Select
              labelId="controlled-label"
              open={controlledOpen}
              onClose={() => setControlledOpen(false)}
              onOpen={() => setControlledOpen(true)}
              value={controlledVal}
              onChange={(e) => setControlledVal(e.target.value)}
              label="制御Select"
              MenuProps={{
                disablePortal,
                PaperProps: { sx: { maxHeight: 300 } },
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                transformOrigin: { vertical: "top", horizontal: "left" },
              }}
            >
              {fruits.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="7) 非同期ロード（疑似）"
          subheader="読み込み完了後にオプションを差し替え"
        />
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button onClick={loadAsync} disabled={loading} variant="outlined">
              {loading ? "読み込み中..." : "再読み込み"}
            </Button>
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="async-label">都市</InputLabel>
            <Select
              labelId="async-label"
              value={asyncVal}
              onChange={(e) => setAsyncVal(e.target.value)}
              label="都市"
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {asyncOpts.length === 0 && (
                <MenuItem disabled value="">
                  {loading ? "読み込み中..." : "データなし"}
                </MenuItem>
              )}
              {asyncOpts.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            選択値: {asyncVal || "(未選択)"}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="8) 検索可能（Autocomplete）"
          subheader="Select ではなく Autocomplete を使うと大規模な選択肢でも検索しやすい"
        />
        <CardContent>
          <Autocomplete
            options={fruits}
            getOptionLabel={(o) => o.label}
            value={autoVal}
            onChange={(_, v) => setAutoVal(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="検索して選択"
                placeholder="例: app..."
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {option.label[0]}
                  </Avatar>
                  <Box>
                    <Typography>{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.info}
                    </Typography>
                  </Box>
                </Stack>
              </li>
            )}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            選択値: {autoVal ? autoVal.label : "(未選択)"}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="9) フリーワード追加（Autocomplete freeSolo + multiple）"
          subheader="候補にない値も作成可能なマルチセレクト"
        />
        <CardContent>
          <Autocomplete
            multiple
            freeSolo
            options={["React", "Vue", "Svelte", "Angular"]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="技術タグ"
                placeholder="入力して Enter で追加"
              />
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="10) 無効項目・ヒント表示"
          subheader="disabled なオプションや補足テキストの付け方"
        />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="disabled-label">プラン</InputLabel>
            <Select
              labelId="disabled-label"
              defaultValue="free"
              label="プラン"
              MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
            >
              <MenuItem value="free">
                <Box>
                  <Typography>Free</Typography>
                  <Typography variant="caption" color="text.secondary">
                    $0 / month
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem disabled value="pro-disabled">
                <Box>
                  <Typography>Pro</Typography>
                  <Typography variant="caption" color="text.secondary">
                    現在在庫切れ / 受付停止中
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="biz">
                <Box>
                  <Typography>Business</Typography>
                  <Typography variant="caption" color="text.secondary">
                    SLA・SSO 対応
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Box sx={{ gridColumn: { md: "1 / span 2", xs: "1" } }}>
        <Card>
          <CardHeader title="活用メモ" />
          <CardContent>
            <ul>
              <li>
                候補が多い場合は <b>Autocomplete</b>{" "}
                を優先（検索付き・仮想化も簡単）
              </li>
              <li>
                <code>MenuProps.PaperProps.sx.maxHeight</code>{" "}
                でメニュー高さを制御
              </li>
              <li>
                <code>renderValue</code> で未選択表示や chips 表示を柔軟に
              </li>
              <li>
                モーダル内のスクロール問題は{" "}
                <code>MenuProps.disablePortal</code> を検討
              </li>
              <li>
                フォーム送信は <code>value</code>{" "}
                は実値（id）、表示はラベルという分離が安全
              </li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
