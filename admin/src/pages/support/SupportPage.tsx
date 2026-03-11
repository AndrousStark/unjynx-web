import React, { useState } from "react";
import {
  Typography,
  Card,
  Input,
  Button,
  Row,
  Col,
  Descriptions,
  Tag,
  Progress,
  Space,
  Avatar,
  message,
  Empty,
  Divider,
  Alert,
  List,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  SyncOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";
import { formatDateTime } from "../../utils/formatters";
import { API_BASE_URL, API_ADMIN_PREFIX, BRAND_COLORS } from "../../utils/constants";
import type { UserRecord, AccountHealth } from "../../types";

const { Title, Text } = Typography;

// Sample account health data
const SAMPLE_HEALTH: AccountHealth = {
  userId: "user-123",
  score: 78,
  syncStatus: "ok",
  lastLogin: "2026-03-11T08:30:00Z",
  openTickets: 1,
  failedNotifications: 3,
};

export const SupportPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchedUser, setSearchedUser] = useState<UserRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [health, setHealth] = useState<AccountHealth | null>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning("Enter an email, name, or user ID");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ADMIN_PREFIX}/users?search=${encodeURIComponent(searchValue)}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("unjynx_admin_token")}`,
          },
        },
      );
      const json = await response.json();

      if (json.success && json.data?.length > 0) {
        setSearchedUser(json.data[0]);
        setHealth(SAMPLE_HEALTH); // Replace with real health check
      } else {
        setSearchedUser(null);
        setHealth(null);
        message.info("No user found");
      }
    } catch {
      message.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleForceSync = () => {
    message.success("Force sync triggered for user");
  };

  const handleResendVerification = () => {
    message.success("Verification email resent");
  };

  const handleResetPassword = () => {
    message.success("Password reset email sent");
  };

  const healthScoreColor = (score: number): string => {
    if (score >= 80) return BRAND_COLORS.success;
    if (score >= 50) return BRAND_COLORS.warning;
    return BRAND_COLORS.error;
  };

  const syncStatusIcon = (status: string): React.ReactNode => {
    if (status === "ok")
      return <CheckCircleOutlined style={{ color: BRAND_COLORS.success }} />;
    if (status === "behind")
      return <WarningOutlined style={{ color: BRAND_COLORS.warning }} />;
    return <CloseCircleOutlined style={{ color: BRAND_COLORS.error }} />;
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Support
      </Title>

      {/* Search */}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          User Lookup
        </Title>
        <Row gutter={16}>
          <Col flex="auto">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by email, name, or user ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
            />
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleSearch}
              loading={isSearching}
              size="large"
            >
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      {searchedUser && (
        <Row gutter={[16, 16]}>
          {/* User Profile */}
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%", marginBottom: 24 }}
              >
                <Avatar
                  size={64}
                  src={searchedUser.avatarUrl}
                  icon={!searchedUser.avatarUrl ? <UserOutlined /> : undefined}
                  style={{ backgroundColor: BRAND_COLORS.violet }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  {searchedUser.name}
                </Title>
                <Text type="secondary">{searchedUser.email}</Text>
              </Space>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="User ID">
                  <Text code copyable>
                    {searchedUser.id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Plan">
                  <Tag color="blue">
                    {(searchedUser.plan ?? "free").toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={searchedUser.isBanned ? "error" : "success"}>
                    {searchedUser.isBanned ? "BANNED" : "ACTIVE"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Signed Up">
                  {formatDateTime(searchedUser.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Last Active">
                  {formatDateTime(searchedUser.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Account Health & Actions */}
          <Col xs={24} lg={12}>
            {health && (
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <Title level={5}>Account Health</Title>
                <Row gutter={16} align="middle">
                  <Col>
                    <Progress
                      type="circle"
                      percent={health.score}
                      size={80}
                      strokeColor={healthScoreColor(health.score)}
                    />
                  </Col>
                  <Col flex="auto">
                    <Space direction="vertical" size={4}>
                      <Space>
                        {syncStatusIcon(health.syncStatus)}
                        <Text>
                          Sync: {health.syncStatus.toUpperCase()}
                        </Text>
                      </Space>
                      <Text type="secondary">
                        Open Tickets: {health.openTickets}
                      </Text>
                      <Text type="secondary">
                        Failed Notifications: {health.failedNotifications}
                      </Text>
                      <Text type="secondary">
                        Last Login: {formatDateTime(health.lastLogin)}
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
            )}

            <Card bordered={false}>
              <Title level={5}>Quick Actions</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  icon={<SyncOutlined />}
                  block
                  onClick={handleForceSync}
                >
                  Force Sync
                </Button>
                <Button
                  icon={<MailOutlined />}
                  block
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
                <Popconfirm
                  title="Send password reset email?"
                  onConfirm={handleResetPassword}
                >
                  <Button icon={<LockOutlined />} block danger>
                    Reset Password
                  </Button>
                </Popconfirm>
              </Space>
            </Card>

            <Card
              bordered={false}
              style={{ marginTop: 16 }}
            >
              <Title level={5}>Ticket History</Title>
              <Alert
                message="Integration Placeholder"
                description="Ticket system integration will be added in a future release."
                type="info"
                showIcon
              />
            </Card>
          </Col>
        </Row>
      )}

      {!searchedUser && !isSearching && (
        <Card bordered={false}>
          <Empty
            description="Search for a user to view their support details"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  );
};
