import React from "react";
import {
  Drawer,
  Tabs,
  Descriptions,
  Avatar,
  Typography,
  Space,
  Tag,
  Button,
  Spin,
  List,
  Empty,
  Popconfirm,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  StopOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useOne, useUpdate } from "@refinedev/core";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatDateTime, planColor } from "../../utils/formatters";
import { PLAN_OPTIONS } from "../../utils/constants";
import type { UserRecord, PlanType } from "../../types";

const { Title, Text } = Typography;

interface UserDetailProps {
  readonly userId: string | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  userId,
  open,
  onClose,
}) => {
  const { data, isLoading } = useOne<UserRecord>({
    resource: "users",
    id: userId ?? "",
    queryOptions: { enabled: !!userId } as never,
  });

  const { mutate: updateUser } = useUpdate();

  const user = data?.data;

  const handleBanToggle = () => {
    if (!userId || !user) return;
    updateUser(
      {
        resource: "users",
        id: userId,
        values: { isBanned: !user.isBanned },
      },
      {
        onSuccess: () => {
          message.success(user.isBanned ? "User unbanned" : "User banned");
        },
      },
    );
  };

  const handlePlanChange = (plan: PlanType) => {
    if (!userId) return;
    updateUser(
      {
        resource: "users",
        id: userId,
        values: { planOverride: plan },
      },
      {
        onSuccess: () => {
          message.success(`Plan changed to ${plan}`);
        },
      },
    );
  };

  return (
    <Drawer
      title={
        <Space>
          <UserOutlined />
          <span>User Detail</span>
        </Space>
      }
      open={open}
      onClose={onClose}
      width={600}
      extra={
        <Space>
          <Popconfirm
            title={user?.isBanned ? "Unban this user?" : "Ban this user?"}
            onConfirm={handleBanToggle}
          >
            <Button
              icon={<StopOutlined />}
              danger={!user?.isBanned}
            >
              {user?.isBanned ? "Unban" : "Ban"}
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : !user ? (
        <Empty description="User not found" />
      ) : (
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: "profile",
              label: "Profile",
              children: (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: 24,
                    }}
                  >
                    <Avatar
                      size={80}
                      src={user.avatarUrl}
                      icon={!user.avatarUrl ? <UserOutlined /> : undefined}
                    />
                    <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                      {user.name}
                    </Title>
                    <Text type="secondary">{user.email}</Text>
                  </div>

                  <Descriptions
                    column={1}
                    bordered
                    size="small"
                    style={{ marginBottom: 24 }}
                  >
                    <Descriptions.Item label="ID">
                      <Text code copyable>
                        {user.id}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <StatusBadge
                        status={user.isBanned ? "banned" : "active"}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Plan">
                      <Tag color={planColor(user.plan ?? "free")}>
                        {(user.plan ?? "free").toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Signed Up">
                      {formatDateTime(user.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Active">
                      {formatDateTime(user.updatedAt)}
                    </Descriptions.Item>
                  </Descriptions>

                  <Title level={5}>Change Plan</Title>
                  <Select
                    value={user.plan ?? "free"}
                    onChange={handlePlanChange}
                    style={{ width: "100%" }}
                    options={PLAN_OPTIONS.map((p) => ({
                      value: p.value,
                      label: p.label,
                    }))}
                  />
                </div>
              ),
            },
            {
              key: "tasks",
              label: "Tasks",
              children: (
                <Empty description="Task history will appear here" />
              ),
            },
            {
              key: "notifications",
              label: "Notifications",
              children: (
                <Empty description="Notification history will appear here" />
              ),
            },
            {
              key: "activity",
              label: "Activity",
              children: (
                <Empty description="Activity log will appear here" />
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};
