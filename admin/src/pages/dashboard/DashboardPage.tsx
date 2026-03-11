import React from "react";
import { Row, Col, Typography, Spin } from "antd";
import {
  UserOutlined,
  RiseOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";
import { StatCard } from "../../components/charts/StatCard";
import { TrendLine } from "../../components/charts/TrendLine";
import { DonutChart } from "../../components/charts/DonutChart";
import { StackedBar } from "../../components/charts/StackedBar";
import { QuickActions } from "../../components/common/QuickActions";
import { formatNumber, formatCurrency } from "../../utils/formatters";
import { API_BASE_URL, API_ADMIN_PREFIX } from "../../utils/constants";
import type { AnalyticsOverview } from "../../types";

const { Title } = Typography;

// Sample data for charts (will be replaced by real API data)
const DAU_TREND_DATA = [
  { date: "Mon", dau: 120, mau: 850 },
  { date: "Tue", dau: 145, mau: 860 },
  { date: "Wed", dau: 132, mau: 870 },
  { date: "Thu", dau: 158, mau: 880 },
  { date: "Fri", dau: 171, mau: 890 },
  { date: "Sat", dau: 89, mau: 895 },
  { date: "Sun", dau: 95, mau: 900 },
];

const REVENUE_BY_PLAN_DATA = [
  { name: "Pro", value: 4500 },
  { name: "Team", value: 2800 },
  { name: "Enterprise", value: 1200 },
  { name: "Free", value: 0 },
];

const NOTIFICATION_DATA = [
  { date: "Mon", push: 450, email: 120, whatsapp: 85, telegram: 45 },
  { date: "Tue", push: 520, email: 145, whatsapp: 92, telegram: 52 },
  { date: "Wed", push: 480, email: 130, whatsapp: 78, telegram: 48 },
  { date: "Thu", push: 560, email: 155, whatsapp: 95, telegram: 55 },
  { date: "Fri", push: 610, email: 170, whatsapp: 100, telegram: 60 },
  { date: "Sat", push: 380, email: 90, whatsapp: 65, telegram: 35 },
  { date: "Sun", push: 340, email: 80, whatsapp: 55, telegram: 30 },
];

const API_LATENCY_DATA = [
  { date: "Mon", p50: 45, p95: 120, p99: 250 },
  { date: "Tue", p50: 42, p95: 115, p99: 230 },
  { date: "Wed", p50: 48, p95: 130, p99: 270 },
  { date: "Thu", p50: 40, p95: 110, p99: 220 },
  { date: "Fri", p50: 44, p95: 125, p99: 245 },
  { date: "Sat", p50: 38, p95: 100, p99: 200 },
  { date: "Sun", p50: 36, p95: 95, p99: 190 },
];

export const DashboardPage: React.FC = () => {
  const { data: overviewData, isLoading } = useCustom<AnalyticsOverview>({
    url: `${API_BASE_URL}${API_ADMIN_PREFIX}/analytics/overview`,
    method: "get",
  });

  const overview = overviewData?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Users"
            value={formatNumber(overview?.totalUsers ?? 0)}
            prefix={<UserOutlined />}
            trend={12.5}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="DAU"
            value={formatNumber(overview?.activeUsersToday ?? 0)}
            prefix={<RiseOutlined />}
            trend={8.3}
            trendLabel="vs yesterday"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="MRR"
            value={formatCurrency(8500)}
            prefix={<DollarOutlined />}
            trend={15.2}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Queue"
            value={formatNumber(overview?.totalSubscriptions ?? 0)}
            prefix={<ThunderboltOutlined />}
            trend={-2.1}
            trendLabel="queue depth"
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <TrendLine
            title="DAU / MAU Trend"
            data={DAU_TREND_DATA}
            dataKeys={[
              { key: "dau", label: "Daily Active Users" },
              { key: "mau", label: "Monthly Active Users" },
            ]}
          />
        </Col>
        <Col xs={24} lg={8}>
          <DonutChart
            title="Revenue by Plan"
            data={REVENUE_BY_PLAN_DATA}
          />
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <StackedBar
            title="Notification Success by Channel"
            data={NOTIFICATION_DATA}
            dataKeys={[
              { key: "push", label: "Push" },
              { key: "email", label: "Email" },
              { key: "whatsapp", label: "WhatsApp" },
              { key: "telegram", label: "Telegram" },
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <TrendLine
            title="API Latency (ms)"
            data={API_LATENCY_DATA}
            dataKeys={[
              { key: "p50", label: "P50" },
              { key: "p95", label: "P95" },
              { key: "p99", label: "P99" },
            ]}
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col span={24}>
          <QuickActions />
        </Col>
      </Row>
    </div>
  );
};
