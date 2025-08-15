import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import { useCustomers, useRegions } from "../../hooks/generateItems";
import MockLayout from "../layout/MockLayout";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

const TreeViewPage: React.FC = () => {
  const { data: regions = [], isLoading: regionsLoading } = useRegions();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(undefined);

  if (regionsLoading || customersLoading) {
    return <CircularProgress />;
  }

  const filteredCustomers = customers.filter(
    (c) => c.locationId === selectedLocationId
  );

  return (
    <MockLayout>
      <Box sx={{ display: "flex" }}>
        {/* 左カラム ツリービュー */}
        <Box sx={{ width: "35%", bgcolor: "#f5f5f5", p: 2, overflow: "auto" }}>
          <Typography variant="h6" gutterBottom>
            ロケーション一覧
          </Typography>
          <TreeView
            expanded={expanded}
            selected={selectedNodeId}
            onNodeToggle={(_event, nodeIds) => setExpanded(nodeIds)}
            onNodeSelect={(_event, nodeId) => {
              setSelectedNodeId(nodeId);

              // Location判定
              const isLocation = regions.some((region) =>
                region.areas.some((area) =>
                  area.locations.some((location) => location.id === nodeId)
                )
              );

              if (isLocation) {
                setSelectedLocationId(nodeId);
              } else {
                setSelectedLocationId(undefined);
              }
            }}
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
          >
            {regions.map((region) => (
              <TreeItem key={region.id} nodeId={region.id} label={region.name}>
                {region.areas.map((area) => (
                  <TreeItem key={area.id} nodeId={area.id} label={area.name}>
                    {area.locations.map((location) => (
                      <TreeItem
                        key={location.id}
                        nodeId={location.id}
                        label={location.name}
                      />
                    ))}
                  </TreeItem>
                ))}
              </TreeItem>
            ))}
          </TreeView>
        </Box>

        {/* 右カラム カスタマー一覧 */}
        <Box
          sx={{
            width: "65%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* 1つ目の顧客一覧 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              顧客一覧①
            </Typography>

            {selectedLocationId ? (
              filteredCustomers.length > 0 ? (
                <List>
                  {filteredCustomers.map((c) => (
                    <ListItem key={`list1-${c.id}`}>
                      <ListItemText primary={c.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>顧客は登録されていません</Typography>
              )
            ) : (
              <Typography>ロケーションを選択してください</Typography>
            )}
          </Box>

          {/* 2つ目の顧客一覧 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              顧客一覧②
            </Typography>

            {selectedLocationId ? (
              filteredCustomers.length > 0 ? (
                <List>
                  {filteredCustomers.map((c) => (
                    <ListItem key={`list2-${c.id}`}>
                      <ListItemText primary={c.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>顧客は登録されていません</Typography>
              )
            ) : (
              <Typography>ロケーションを選択してください</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </MockLayout>
  );
};

export default TreeViewPage;
