import React, { useState } from "react";
import {
  Typography,
  Card,
  Table,
  Tabs,
  Tag,
  Select,
  Input,
  Row,
  Col,
  Button,
  Space,
  Descriptions,
  Timeline,
  Alert,
  List,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  SafetyOutlined,
  FileProtectOutlined,
  AuditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import { formatDateTime, formatDate } from "../../utils/formatters";
import { BRAND_COLORS } from "../../utils/constants";
import type { AuditLogRecord } from "../../types";

const { Title, Text, Paragraph } = Typography;

// Sample GDPR requests
const GDPR_REQUESTS = [
  {
    id: "gdpr-001",
    userId: "user-123",
    email: "arjun@example.com",
    type: "export",
    status: "pending",
    requestedAt: "2026-03-10T14:00:00Z",
  },
  {
    id: "gdpr-002",
    userId: "user-456",
    email: "priya@example.com",
    type: "deletion",
    status: "completed",
    requestedAt: "2026-03-08T10:00:00Z",
    completedAt: "2026-03-09T10:00:00Z",
  },
  {
    id: "gdpr-003",
    userId: "user-789",
    email: "rahul@example.com",
    type: "export",
    status: "processing",
    requestedAt: "2026-03-11T08:00:00Z",
  },
];

// Data retention policies
const RETENTION_POLICIES = [
  {
    category: "User Profiles",
    retention: "Account lifetime + 30 days",
    legal: "DPDP Act 2023",
    description: "Retained while account is active. Deleted 30 days after account deletion request.",
  },
  {
    category: "Task Data",
    retention: "Account lifetime + 30 days",
    legal: "DPDP Act 2023",
    description: "User-generated task data tied to account lifecycle.",
  },
  {
    category: "Notification Logs",
    retention: "90 days",
    legal: "Business operations",
    description: "Delivery logs retained for debugging and analytics.",
  },
  {
    category: "Audit Logs",
    retention: "2 years",
    legal: "Compliance requirement",
    description: "Admin actions retained for security and compliance audits.",
  },
  {
    category: "Payment Records",
    retention: "7 years",
    legal: "Tax/Financial regulations",
    description: "Required by Indian tax law and payment processor agreements.",
  },
  {
    category: "Analytics Events",
    retention: "1 year",
    legal: "Business operations",
    description: "Anonymized after 90 days, deleted after 1 year.",
  },
];

// Consent types
const CONSENT_RECORDS = [
  { type: "Marketing Emails", collected: true, required: false, users: 650 },
  { type: "Push Notifications", collected: true, required: false, users: 820 },
  { type: "WhatsApp Messages", collected: true, required: false, users: 380 },
  { type: "Analytics Tracking", collected: true, required: false, users: 890 },
  { type: "Terms of Service", collected: true, required: true, users: 900 },
  { type: "Privacy Policy", collected: true, required: true, users: 900 },
];

export const CompliancePage: React.FC = () => {
  const { tableProps, setFilters } = useTable<AuditLogRecord>({
    resource: "audit-log",
    pagination: { pageSize: 20, mode: "server" },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  });

  const handleExport = (requestId: string) => {
    message.success(`Data export initiated for ${requestId}`);
  };

  const handleProcessDeletion = (requestId: string) => {
    message.success(`Deletion request ${requestId} processing started`);
  };

  const auditColumns = [
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 160,
      render: (action: string) => <Tag color="purple">{action}</Tag>,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 140,
      render: (id: string) => (
        <Text code style={{ fontSize: 11 }}>
          {id.slice(0, 12)}...
        </Text>
      ),
    },
    {
      title: "Resource",
      key: "resource",
      width: 150,
      render: (_: unknown, record: AuditLogRecord) => (
        <Space>
          <Tag>{record.entityType}</Tag>
          {record.entityId && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.entityId.slice(0, 8)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Details",
      dataIndex: "metadata",
      key: "metadata",
      render: (metadata: string | undefined) => {
        if (!metadata) return <Text type="secondary">-</Text>;
        try {
          const parsed = JSON.parse(metadata);
          return (
            <Text style={{ fontSize: 12 }}>
              {JSON.stringify(parsed).slice(0, 80)}
            </Text>
          );
        } catch {
          return <Text style={{ fontSize: 12 }}>{metadata.slice(0, 80)}</Text>;
        }
      },
    },
    {
      title: "IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 120,
      render: (ip: string | undefined) =>
        ip ?? <Text type="secondary">-</Text>,
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Compliance
      </Title>

      <Tabs
        defaultActiveKey="audit"
        items={[
          {
            key: "audit",
            label: (
              <Space>
                <AuditOutlined />
                Audit Log
              </Space>
            ),
            children: (
              <div>
                <Card bordered={false} style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8}>
                      <Input
                        prefix={<SearchOutlined />}
                        placeholder="Filter by action..."
                        allowClear
                        onChange={(e) => {
                          setFilters([
                            {
                              field: "action",
                              operator: "eq",
                              value: e.target.value,
                            },
                          ]);
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Input
                        placeholder="Filter by user ID..."
                        allowClear
                        onChange={(e) => {
                          setFilters([
                            {
                              field: "userId",
                              operator: "eq",
                              value: e.target.value,
                            },
                          ]);
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Button icon={<DownloadOutlined />}>
                        Export Audit Log
                      </Button>
                    </Col>
                  </Row>
                </Card>

                <Card bordered={false}>
                  <Table
                    {...tableProps}
                    columns={auditColumns}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    size="middle"
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "gdpr",
            label: (
              <Space>
                <FileProtectOutlined />
                GDPR / DPDP
              </Space>
            ),
            children: (
              <div>
                <Alert
                  message="India DPDP Act 2023 Compliance"
                  description="All data handling must comply with the Digital Personal Data Protection Act 2023 (deadline: May 2027). Data export requests must be fulfilled within 30 days."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Card bordered={false}>
                  <Title level={5}>Data Subject Requests</Title>
                  <Table
                    dataSource={GDPR_REQUESTS}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                    columns={[
                      {
                        title: "Request ID",
                        dataIndex: "id",
                        key: "id",
                        render: (id: string) => <Text code>{id}</Text>,
                      },
                      {
                        title: "Email",
                        dataIndex: "email",
                        key: "email",
                      },
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                        render: (type: string) => (
                          <Tag color={type === "export" ? "blue" : "red"}>
                            {type.toUpperCase()}
                          </Tag>
                        ),
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (status: string) => (
                          <Tag
                            color={
                              status === "completed"
                                ? "success"
                                : status === "processing"
                                  ? "processing"
                                  : "warning"
                            }
                          >
                            {status.toUpperCase()}
                          </Tag>
                        ),
                      },
                      {
                        title: "Requested",
                        dataIndex: "requestedAt",
                        key: "requestedAt",
                        render: (date: string) => formatDate(date),
                      },
                      {
                        title: "Action",
                        key: "action",
                        render: (_: unknown, record: { id: string; type: string; status: string }) => {
                          if (record.status === "completed") return null;
                          return record.type === "export" ? (
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => handleExport(record.id)}
                            >
                              Export
                            </Button>
                          ) : (
                            <Popconfirm
                              title="Process deletion request? This is irreversible."
                              onConfirm={() =>
                                handleProcessDeletion(record.id)
                              }
                            >
                              <Button size="small" danger>
                                Process
                              </Button>
                            </Popconfirm>
                          );
                        },
                      },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "consent",
            label: (
              <Space>
                <SafetyOutlined />
                Consent
              </Space>
            ),
            children: (
              <Card bordered={false}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  Consent Management
                </Title>
                <Table
                  dataSource={CONSENT_RECORDS}
                  rowKey="type"
                  size="middle"
                  pagination={false}
                  columns={[
                    {
                      title: "Consent Type",
                      dataIndex: "type",
                      key: "type",
                      render: (type: string) => <Text strong>{type}</Text>,
                    },
                    {
                      title: "Required",
                      dataIndex: "required",
                      key: "required",
                      width: 100,
                      render: (required: boolean) =>
                        required ? (
                          <Tag color="red">Required</Tag>
                        ) : (
                          <Tag>Optional</Tag>
                        ),
                    },
                    {
                      title: "Users Consented",
                      dataIndex: "users",
                      key: "users",
                      width: 140,
                      render: (users: number) => users.toLocaleString(),
                    },
                    {
                      title: "Collection Status",
                      dataIndex: "collected",
                      key: "collected",
                      width: 140,
                      render: (collected: boolean) =>
                        collected ? (
                          <Tag color="success">Active</Tag>
                        ) : (
                          <Tag color="error">Not Collected</Tag>
                        ),
                    },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: "retention",
            label: (
              <Space>
                <ClockCircleOutlined />
                Data Retention
              </Space>
            ),
            children: (
              <Card bordered={false}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  Data Retention Policies
                </Title>
                <List
                  dataSource={RETENTION_POLICIES}
                  renderItem={(policy) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>{policy.category}</Text>
                            <Tag color="blue">{policy.retention}</Tag>
                            <Tag>{policy.legal}</Tag>
                          </Space>
                        }
                        description={policy.description}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};
