import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Avatar,
  Typography,
  Button,
  Tag,
  DatePicker,
  Row,
  Col,
  Card,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import { UserDetail } from "./UserDetail";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatDate, formatRelativeTime, planColor } from "../../utils/formatters";
import { PLAN_OPTIONS } from "../../utils/constants";
import type { UserRecord } from "../../types";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const UserList: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { tableProps, searchFormProps, filters, setFilters } = useTable<UserRecord>({
    resource: "users",
    pagination: { pageSize: 20, mode: "server" },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  });

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setDetailOpen(true);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: UserRecord) => (
        <Space>
          <Avatar
            size="small"
            src={record.avatarUrl}
            icon={!record.avatarUrl ? <UserOutlined /> : undefined}
          />
          <div>
            <Text strong>{name ?? "Unknown"}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      width: 100,
      render: (plan: string) => (
        <Tag color={planColor(plan ?? "free")}>
          {(plan ?? "free").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isBanned",
      key: "status",
      width: 110,
      render: (isBanned: boolean) => (
        <StatusBadge status={isBanned ? "banned" : "active"} />
      ),
    },
    {
      title: "Signed Up",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      sorter: true,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Last Active",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (date: string) => formatRelativeTime(date),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: UserRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record.id)}
            size="small"
          />
          <Button
            type="text"
            icon={<StopOutlined />}
            danger
            size="small"
            title={record.isBanned ? "Unban" : "Suspend"}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        User Management
      </Title>

      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by name or email..."
              allowClear
              onChange={(e) => {
                setFilters([
                  { field: "search", operator: "eq", value: e.target.value },
                ]);
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by Plan"
              allowClear
              style={{ width: "100%" }}
              options={PLAN_OPTIONS.map((p) => ({
                value: p.value,
                label: p.label,
              }))}
              onChange={(value) => {
                setFilters([
                  { field: "plan", operator: "eq", value },
                ]);
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: "100%" }}
              options={[
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" },
                { value: "banned", label: "Banned" },
              ]}
              onChange={(value) => {
                setFilters([
                  { field: "status", operator: "eq", value },
                ]);
              }}
            />
          </Col>
          <Col xs={24} sm={4}>
            <RangePicker style={{ width: "100%" }} />
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      <UserDetail
        userId={selectedUserId}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};
