import React from "react";
import {
  Table,
  Typography,
  Button,
  Card,
  Space,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import { formatDateTime } from "../../utils/formatters";
import type { ChannelType } from "../../types";

const { Title, Text } = Typography;

// Sample failed notifications data
const FAILED_NOTIFICATIONS = [
  {
    id: "fn-001",
    userId: "user-123",
    channel: "whatsapp" as ChannelType,
    error: "Template not approved by Meta",
    attempts: 3,
    createdAt: "2026-03-11T08:30:00Z",
  },
  {
    id: "fn-002",
    userId: "user-456",
    channel: "sms" as ChannelType,
    error: "MSG91 rate limit exceeded",
    attempts: 2,
    createdAt: "2026-03-11T09:15:00Z",
  },
  {
    id: "fn-003",
    userId: "user-789",
    channel: "email" as ChannelType,
    error: "SendGrid bounce: invalid address",
    attempts: 1,
    createdAt: "2026-03-11T10:00:00Z",
  },
  {
    id: "fn-004",
    userId: "user-101",
    channel: "discord" as ChannelType,
    error: "Bot token expired",
    attempts: 5,
    createdAt: "2026-03-11T06:45:00Z",
  },
  {
    id: "fn-005",
    userId: "user-202",
    channel: "telegram" as ChannelType,
    error: "User blocked the bot",
    attempts: 1,
    createdAt: "2026-03-11T11:20:00Z",
  },
];

export const FailedNotifications: React.FC = () => {
  const { push } = useNavigation();

  const handleRetry = (id: string) => {
    message.info(`Retrying notification ${id}...`);
  };

  const handleRetryAll = () => {
    message.info("Retrying all failed notifications...");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => <Text code>{id}</Text>,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      width: 120,
      render: (userId: string) => <Text code>{userId.slice(0, 12)}...</Text>,
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
      width: 110,
      render: (channel: string) => (
        <Tag style={{ textTransform: "capitalize" }}>{channel}</Tag>
      ),
    },
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      render: (error: string) => (
        <Text type="danger" style={{ fontSize: 13 }}>
          {error}
        </Text>
      ),
    },
    {
      title: "Attempts",
      dataIndex: "attempts",
      key: "attempts",
      width: 90,
      render: (attempts: number) => (
        <Tag color={attempts >= 3 ? "error" : "warning"}>{attempts}</Tag>
      ),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: unknown, record: { id: string }) => (
        <Popconfirm
          title="Retry this notification?"
          onConfirm={() => handleRetry(record.id)}
        >
          <Button
            type="text"
            icon={<RetweetOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => push("/notifications")}
            >
              Back
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Failed Notifications
            </Title>
          </Space>
        </Col>
        <Col>
          <Popconfirm
            title="Retry all failed notifications?"
            onConfirm={handleRetryAll}
          >
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              danger
            >
              Retry All
            </Button>
          </Popconfirm>
        </Col>
      </Row>

      <Card bordered={false}>
        <Table
          dataSource={FAILED_NOTIFICATIONS}
          columns={columns}
          rowKey="id"
          scroll={{ x: 800 }}
          size="middle"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
};
