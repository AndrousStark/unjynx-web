import React, { useState } from "react";
import {
  Typography,
  Card,
  Table,
  Tag,
  Select,
  Row,
  Col,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  message,
  Popconfirm,
  Tabs,
  Descriptions,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  DollarOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { StatusBadge } from "../../components/common/StatusBadge";
import {
  formatDate,
  formatCurrency,
  formatNumber,
  planColor,
} from "../../utils/formatters";
import { PLAN_OPTIONS, BRAND_COLORS } from "../../utils/constants";
import type {
  SubscriptionRecord,
  CouponRecord,
  PlanType,
} from "../../types";

const { Title, Text } = Typography;

// Sample data
const SUBSCRIPTIONS: readonly SubscriptionRecord[] = [
  {
    id: "sub-001",
    userId: "user-123",
    userName: "Arjun Sharma",
    plan: "pro",
    status: "active",
    currentPeriodEnd: "2026-04-10T00:00:00Z",
    amount: 6.99,
    currency: "USD",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "sub-002",
    userId: "user-456",
    userName: "Priya Patel",
    plan: "team",
    status: "active",
    currentPeriodEnd: "2026-04-15T00:00:00Z",
    amount: 8.99,
    currency: "USD",
    createdAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "sub-003",
    userId: "user-789",
    userName: "Rahul Verma",
    plan: "pro",
    status: "past_due",
    currentPeriodEnd: "2026-03-01T00:00:00Z",
    amount: 6.99,
    currency: "USD",
    createdAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "sub-004",
    userId: "user-101",
    userName: "Sneha Gupta",
    plan: "enterprise",
    status: "active",
    currentPeriodEnd: "2026-06-01T00:00:00Z",
    amount: 49.99,
    currency: "USD",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sub-005",
    userId: "user-202",
    userName: "Vikram Singh",
    plan: "pro",
    status: "cancelled",
    currentPeriodEnd: "2026-03-20T00:00:00Z",
    amount: 4.99,
    currency: "USD",
    createdAt: "2025-09-20T00:00:00Z",
  },
];

const COUPONS: readonly CouponRecord[] = [
  {
    id: "coupon-001",
    code: "LAUNCH50",
    discountPercent: 50,
    maxUses: 100,
    usedCount: 45,
    expiresAt: "2026-06-30T00:00:00Z",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "coupon-002",
    code: "BETA20",
    discountPercent: 20,
    maxUses: 500,
    usedCount: 312,
    expiresAt: "2026-12-31T00:00:00Z",
    isActive: true,
    createdAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "coupon-003",
    code: "FRIEND10",
    discountPercent: 10,
    maxUses: 1000,
    usedCount: 89,
    expiresAt: "2027-01-01T00:00:00Z",
    isActive: true,
    createdAt: "2026-02-01T00:00:00Z",
  },
];

interface CouponFormValues {
  readonly code: string;
  readonly discountPercent: number;
  readonly maxUses: number;
  readonly expiresAt: string;
}

export const BillingPage: React.FC = () => {
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponForm] = Form.useForm();
  const [planFilter, setPlanFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const handleCreateCoupon = (values: CouponFormValues) => {
    message.success(`Coupon ${values.code} created`);
    setCouponModalOpen(false);
    couponForm.resetFields();
  };

  const handleRefund = (subId: string) => {
    message.success(`Refund initiated for ${subId}`);
  };

  const subscriptionColumns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      render: (name: string, record: SubscriptionRecord) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.userId}
          </Text>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      width: 100,
      render: (plan: PlanType) => (
        <Tag color={planColor(plan)}>{plan.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount: number, record: SubscriptionRecord) =>
        formatCurrency(amount, record.currency),
    },
    {
      title: "Period End",
      dataIndex: "currentPeriodEnd",
      key: "currentPeriodEnd",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: unknown, record: SubscriptionRecord) => (
        <Space>
          <Button type="text" icon={<FileTextOutlined />} size="small" title="View Invoice" />
          <Popconfirm
            title="Process refund?"
            onConfirm={() => handleRefund(record.id)}
          >
            <Button type="text" icon={<DollarOutlined />} danger size="small" title="Refund" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const couponColumns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Text code copyable>{code}</Text>,
    },
    {
      title: "Discount",
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: 100,
      render: (pct: number) => <Tag color="green">{pct}% OFF</Tag>,
    },
    {
      title: "Usage",
      key: "usage",
      width: 120,
      render: (_: unknown, record: CouponRecord) => (
        <Text>
          {record.usedCount} / {record.maxUses}
        </Text>
      ),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      render: (isActive: boolean) => (
        <Switch checked={isActive} size="small" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: unknown, record: CouponRecord) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} danger size="small" />
        </Space>
      ),
    },
  ];

  const filteredSubs = SUBSCRIPTIONS.filter((sub) => {
    if (planFilter && sub.plan !== planFilter) return false;
    if (statusFilter && sub.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Billing
      </Title>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Active Subscriptions"
              value={3}
              valueStyle={{ color: BRAND_COLORS.violet }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="MRR"
              value={8500}
              prefix="$"
              valueStyle={{ color: BRAND_COLORS.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Coupons Active"
              value={3}
              valueStyle={{ color: BRAND_COLORS.gold }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="subscriptions"
        items={[
          {
            key: "subscriptions",
            label: "Subscriptions",
            children: (
              <div>
                <Card bordered={false} style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={12} sm={6}>
                      <Select
                        placeholder="Filter by Plan"
                        allowClear
                        style={{ width: "100%" }}
                        value={planFilter}
                        onChange={setPlanFilter}
                        options={PLAN_OPTIONS.map((p) => ({
                          value: p.value,
                          label: p.label,
                        }))}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Select
                        placeholder="Filter by Status"
                        allowClear
                        style={{ width: "100%" }}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                          { value: "active", label: "Active" },
                          { value: "cancelled", label: "Cancelled" },
                          { value: "past_due", label: "Past Due" },
                          { value: "trialing", label: "Trialing" },
                        ]}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card bordered={false}>
                  <Table
                    dataSource={filteredSubs as SubscriptionRecord[]}
                    columns={subscriptionColumns}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    size="middle"
                    pagination={{ pageSize: 20 }}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "coupons",
            label: "Coupons",
            children: (
              <div>
                <Row
                  justify="end"
                  style={{ marginBottom: 16 }}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCouponModalOpen(true)}
                  >
                    New Coupon
                  </Button>
                </Row>

                <Card bordered={false}>
                  <Table
                    dataSource={COUPONS as CouponRecord[]}
                    columns={couponColumns}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* Coupon Modal */}
      <Modal
        title="Create Coupon"
        open={couponModalOpen}
        onCancel={() => setCouponModalOpen(false)}
        footer={null}
      >
        <Form<CouponFormValues>
          form={couponForm}
          layout="vertical"
          onFinish={handleCreateCoupon}
        >
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[
              { required: true, message: "Code is required" },
              {
                pattern: /^[A-Z0-9]+$/,
                message: "Uppercase letters and numbers only",
              },
            ]}
          >
            <Input placeholder="e.g., SUMMER30" />
          </Form.Item>

          <Form.Item
            name="discountPercent"
            label="Discount (%)"
            rules={[{ required: true, message: "Discount is required" }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="maxUses"
            label="Max Uses"
            rules={[{ required: true, message: "Max uses is required" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="expiresAt"
            label="Expires At"
            rules={[{ required: true, message: "Expiration date is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Coupon
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
