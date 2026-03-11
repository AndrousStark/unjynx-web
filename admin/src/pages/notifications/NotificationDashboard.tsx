import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  Space,
  Button,
} from "antd";
import {
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import { TrendLine } from "../../components/charts/TrendLine";
import { StackedBar } from "../../components/charts/StackedBar";
import { BRAND_COLORS } from "../../utils/constants";
import { formatNumber, formatCurrency } from "../../utils/formatters";
import type { ChannelHealth, QueueStatus } from "../../types";

const { Title, Text } = Typography;

// Sample data - will be replaced by real API
const CHANNEL_HEALTH: readonly ChannelHealth[] = [
  {
    channel: "push",
    status: "healthy",
    successRate: 98.5,
    lastDelivery: "2 min ago",
    queueSize: 45,
    costToday: 0,
  },
  {
    channel: "whatsapp",
    status: "healthy",
    successRate: 96.2,
    lastDelivery: "5 min ago",
    queueSize: 12,
    costToday: 45.3,
  },
  {
    channel: "telegram",
    status: "healthy",
    successRate: 99.1,
    lastDelivery: "1 min ago",
    queueSize: 3,
    costToday: 0,
  },
  {
    channel: "email",
    status: "healthy",
    successRate: 97.8,
    lastDelivery: "3 min ago",
    queueSize: 28,
    costToday: 12.5,
  },
  {
    channel: "sms",
    status: "degraded",
    successRate: 89.4,
    lastDelivery: "15 min ago",
    queueSize: 156,
    costToday: 78.2,
  },
  {
    channel: "instagram",
    status: "healthy",
    successRate: 94.6,
    lastDelivery: "8 min ago",
    queueSize: 7,
    costToday: 0,
  },
  {
    channel: "slack",
    status: "healthy",
    successRate: 99.8,
    lastDelivery: "30 sec ago",
    queueSize: 0,
    costToday: 0,
  },
  {
    channel: "discord",
    status: "down",
    successRate: 0,
    lastDelivery: "2 hours ago",
    queueSize: 342,
    costToday: 0,
  },
];

const QUEUE_STATUS: readonly QueueStatus[] = [
  { name: "push", active: 12, waiting: 33, completed: 4520, failed: 15 },
  { name: "email", active: 5, waiting: 23, completed: 1890, failed: 8 },
  { name: "whatsapp", active: 3, waiting: 9, completed: 780, failed: 22 },
  { name: "telegram", active: 1, waiting: 2, completed: 560, failed: 3 },
  { name: "sms", active: 8, waiting: 148, completed: 420, failed: 45 },
  { name: "digest", active: 0, waiting: 5, completed: 150, failed: 0 },
  { name: "escalation", active: 2, waiting: 8, completed: 89, failed: 4 },
];

const DELIVERY_FUNNEL = [
  { stage: "Queued", push: 500, email: 200, whatsapp: 100, sms: 80 },
  { stage: "Sent", push: 495, email: 195, whatsapp: 96, sms: 72 },
  { stage: "Delivered", push: 490, email: 190, whatsapp: 94, sms: 65 },
  { stage: "Read", push: 320, email: 85, whatsapp: 82, sms: 45 },
  { stage: "Acted", push: 145, email: 42, whatsapp: 38, sms: 18 },
];

const COST_TREND = [
  { date: "Mon", whatsapp: 42, sms: 65, email: 10, total: 117 },
  { date: "Tue", whatsapp: 48, sms: 72, email: 12, total: 132 },
  { date: "Wed", whatsapp: 38, sms: 58, email: 9, total: 105 },
  { date: "Thu", whatsapp: 52, sms: 80, email: 14, total: 146 },
  { date: "Fri", whatsapp: 55, sms: 85, email: 15, total: 155 },
  { date: "Sat", whatsapp: 30, sms: 45, email: 7, total: 82 },
  { date: "Sun", whatsapp: 25, sms: 38, email: 6, total: 69 },
];

function channelStatusColor(status: string): string {
  if (status === "healthy") return BRAND_COLORS.success;
  if (status === "degraded") return BRAND_COLORS.warning;
  return BRAND_COLORS.error;
}

function channelIcon(channel: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    push: <BellOutlined />,
    email: <MailOutlined />,
    sms: <MessageOutlined />,
    telegram: <SendOutlined />,
    whatsapp: <MessageOutlined />,
    instagram: <MessageOutlined />,
    slack: <MessageOutlined />,
    discord: <MessageOutlined />,
  };
  return iconMap[channel] ?? <BellOutlined />;
}

export const NotificationDashboard: React.FC = () => {
  const { push } = useNavigation();

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Notification Management
          </Title>
        </Col>
        <Col>
          <Space>
            <Button onClick={() => push("/notifications/failed")}>
              Failed Notifications
            </Button>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </Space>
        </Col>
      </Row>

      {/* Channel Health Cards */}
      <Title level={5} style={{ marginBottom: 12 }}>
        Channel Health
      </Title>
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        {CHANNEL_HEALTH.map((ch) => (
          <Col xs={12} sm={8} md={6} key={ch.channel}>
            <Card
              bordered={false}
              size="small"
              style={{
                borderLeft: `3px solid ${channelStatusColor(ch.status)}`,
              }}
            >
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Space>
                  {channelIcon(ch.channel)}
                  <Text strong style={{ textTransform: "capitalize" }}>
                    {ch.channel}
                  </Text>
                  <Tag
                    color={
                      ch.status === "healthy"
                        ? "success"
                        : ch.status === "degraded"
                          ? "warning"
                          : "error"
                    }
                  >
                    {ch.status}
                  </Tag>
                </Space>
                <Progress
                  percent={ch.successRate}
                  size="small"
                  status={ch.successRate < 90 ? "exception" : "success"}
                  format={(p) => `${p}%`}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Queue: {ch.queueSize} | Cost: {formatCurrency(ch.costToday)}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Queue Status */}
      <Title level={5} style={{ marginBottom: 12 }}>
        Queue Status
      </Title>
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        {QUEUE_STATUS.map((q) => (
          <Col xs={12} sm={8} md={6} lg={3} key={q.name}>
            <Card bordered={false} size="small">
              <Text strong style={{ textTransform: "capitalize", fontSize: 13 }}>
                {q.name}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Space size={4}>
                  <Tag color="processing">{q.active} active</Tag>
                </Space>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Waiting: {q.waiting} | Done: {formatNumber(q.completed)} |
                    Failed: {q.failed}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <StackedBar
            title="Delivery Funnel"
            data={DELIVERY_FUNNEL}
            xAxisKey="stage"
            dataKeys={[
              { key: "push", label: "Push" },
              { key: "email", label: "Email" },
              { key: "whatsapp", label: "WhatsApp" },
              { key: "sms", label: "SMS" },
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <TrendLine
            title="Cost by Channel (USD/day)"
            data={COST_TREND}
            dataKeys={[
              { key: "whatsapp", label: "WhatsApp" },
              { key: "sms", label: "SMS" },
              { key: "email", label: "Email" },
              { key: "total", label: "Total" },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};
