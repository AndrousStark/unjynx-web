import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Segmented,
  Table,
  Statistic,
  Space,
} from "antd";
import {
  UserOutlined,
  RiseOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";
import { StatCard } from "../../components/charts/StatCard";
import { TrendLine } from "../../components/charts/TrendLine";
import { StackedBar } from "../../components/charts/StackedBar";
import { DonutChart } from "../../components/charts/DonutChart";
import { formatNumber, formatCurrency, formatPercentage } from "../../utils/formatters";
import { API_BASE_URL, API_ADMIN_PREFIX, BRAND_COLORS } from "../../utils/constants";

const { Title, Text } = Typography;

type AnalyticsTab = "growth" | "engagement" | "revenue" | "cohort";

// Sample data
const SIGNUP_TREND = [
  { date: "Week 1", signups: 45, organic: 32, referral: 13 },
  { date: "Week 2", signups: 62, organic: 41, referral: 21 },
  { date: "Week 3", signups: 58, organic: 38, referral: 20 },
  { date: "Week 4", signups: 73, organic: 50, referral: 23 },
  { date: "Week 5", signups: 89, organic: 61, referral: 28 },
  { date: "Week 6", signups: 95, organic: 65, referral: 30 },
];

const RETENTION_DATA = [
  { date: "Day 1", rate: 100 },
  { date: "Day 3", rate: 72 },
  { date: "Day 7", rate: 58 },
  { date: "Day 14", rate: 45 },
  { date: "Day 30", rate: 35 },
  { date: "Day 60", rate: 28 },
  { date: "Day 90", rate: 22 },
];

const FEATURE_ADOPTION = [
  { name: "Task Creation", value: 95 },
  { name: "Reminders", value: 78 },
  { name: "Calendar", value: 62 },
  { name: "Pomodoro", value: 45 },
  { name: "Ghost Mode", value: 38 },
  { name: "Content Feed", value: 55 },
];

const REVENUE_TREND = [
  { date: "Jan", mrr: 2800, arr: 33600 },
  { date: "Feb", mrr: 3400, arr: 40800 },
  { date: "Mar", mrr: 4100, arr: 49200 },
  { date: "Apr", mrr: 5200, arr: 62400 },
  { date: "May", mrr: 6500, arr: 78000 },
  { date: "Jun", mrr: 8500, arr: 102000 },
];

const COHORT_DATA = [
  { cohort: "Jan 2026", month0: "100%", month1: "68%", month2: "52%", month3: "41%", month4: "35%", month5: "30%" },
  { cohort: "Feb 2026", month0: "100%", month1: "72%", month2: "55%", month3: "44%", month4: "38%", month5: "-" },
  { cohort: "Mar 2026", month0: "100%", month1: "70%", month2: "53%", month3: "42%", month4: "-", month5: "-" },
];

const TASK_ACTIVITY = [
  { date: "Mon", created: 450, completed: 380 },
  { date: "Tue", created: 520, completed: 440 },
  { date: "Wed", created: 480, completed: 410 },
  { date: "Thu", created: 560, completed: 475 },
  { date: "Fri", created: 610, completed: 520 },
  { date: "Sat", created: 280, completed: 240 },
  { date: "Sun", created: 250, completed: 210 },
];

const CHURN_DATA = [
  { name: "Free", value: 15 },
  { name: "Pro", value: 5 },
  { name: "Team", value: 3 },
  { name: "Enterprise", value: 1 },
];

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("growth");

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Analytics
      </Title>

      <Segmented
        value={activeTab}
        onChange={(val) => setActiveTab(val as AnalyticsTab)}
        options={[
          { label: "Growth", value: "growth", icon: <RiseOutlined /> },
          { label: "Engagement", value: "engagement", icon: <TeamOutlined /> },
          { label: "Revenue", value: "revenue", icon: <DollarOutlined /> },
          { label: "Cohort", value: "cohort", icon: <UserOutlined /> },
        ]}
        block
        style={{ marginBottom: 24 }}
      />

      {activeTab === "growth" && (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Signups"
                value={formatNumber(422)}
                prefix={<UserOutlined />}
                trend={18.5}
                trendLabel="this month"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="DAU / WAU / MAU"
                value="158 / 620 / 900"
                prefix={<RiseOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="30-Day Retention"
                value={formatPercentage(35)}
                trend={2.1}
                trendLabel="vs last month"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <TrendLine
                title="Signup Trend"
                data={SIGNUP_TREND}
                dataKeys={[
                  { key: "signups", label: "Total" },
                  { key: "organic", label: "Organic" },
                  { key: "referral", label: "Referral" },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <TrendLine
                title="Retention Curve"
                data={RETENTION_DATA}
                dataKeys={[
                  { key: "rate", label: "Retention %" },
                ]}
              />
            </Col>
          </Row>
        </div>
      )}

      {activeTab === "engagement" && (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Tasks Created Today"
                value={formatNumber(610)}
                trend={8.2}
                trendLabel="vs yesterday"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Completion Rate"
                value={formatPercentage(84.5)}
                trend={1.8}
                trendLabel="vs last week"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Avg Session Duration"
                value="12m 34s"
                trend={5.2}
                trendLabel="vs last week"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <StackedBar
                title="Tasks Created vs Completed"
                data={TASK_ACTIVITY}
                dataKeys={[
                  { key: "created", label: "Created" },
                  { key: "completed", label: "Completed" },
                ]}
                stacked={false}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DonutChart
                title="Feature Adoption"
                data={FEATURE_ADOPTION}
              />
            </Col>
          </Row>
        </div>
      )}

      {activeTab === "revenue" && (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <StatCard
                title="MRR"
                value={formatCurrency(8500)}
                prefix={<DollarOutlined />}
                trend={15.2}
              />
            </Col>
            <Col xs={24} sm={6}>
              <StatCard
                title="ARR"
                value={formatCurrency(102000)}
                trend={22.8}
              />
            </Col>
            <Col xs={24} sm={6}>
              <StatCard
                title="ARPU"
                value={formatCurrency(9.44)}
                trend={3.1}
              />
            </Col>
            <Col xs={24} sm={6}>
              <StatCard
                title="LTV"
                value={formatCurrency(85)}
                trend={7.5}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <TrendLine
                title="MRR / ARR Growth"
                data={REVENUE_TREND}
                dataKeys={[
                  { key: "mrr", label: "MRR" },
                  { key: "arr", label: "ARR" },
                ]}
              />
            </Col>
            <Col xs={24} lg={10}>
              <DonutChart
                title="Churn by Plan (%)"
                data={CHURN_DATA}
              />
            </Col>
          </Row>
        </div>
      )}

      {activeTab === "cohort" && (
        <Card bordered={false}>
          <Title level={5} style={{ marginBottom: 16 }}>
            Monthly Cohort Retention
          </Title>
          <Table
            dataSource={COHORT_DATA}
            columns={[
              { title: "Cohort", dataIndex: "cohort", key: "cohort" },
              { title: "Month 0", dataIndex: "month0", key: "month0" },
              { title: "Month 1", dataIndex: "month1", key: "month1" },
              { title: "Month 2", dataIndex: "month2", key: "month2" },
              { title: "Month 3", dataIndex: "month3", key: "month3" },
              { title: "Month 4", dataIndex: "month4", key: "month4" },
              { title: "Month 5", dataIndex: "month5", key: "month5" },
            ]}
            rowKey="cohort"
            pagination={false}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
};
