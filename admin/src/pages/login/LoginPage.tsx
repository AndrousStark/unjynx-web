import React from "react";
import { Card, Form, Input, Button, Typography, Divider, Space, Alert } from "antd";
import { LockOutlined, MailOutlined, SafetyOutlined } from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { BRAND_COLORS } from "../../utils/constants";

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  readonly email: string;
  readonly password: string;
}

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending } = useLogin<LoginFormValues>();
  const [error, setError] = React.useState<string | null>(null);

  const handleEmailLogin = (values: LoginFormValues) => {
    setError(null);
    login(values, {
      onError: (err) => {
        setError(err?.message ?? "Login failed");
      },
    });
  };

  const handleSSOLogin = () => {
    login({ providerName: "logto" } as never);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BRAND_COLORS.midnight} 0%, #1a1030 50%, ${BRAND_COLORS.midnight} 100%)`,
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 12,
          boxShadow: `0 8px 32px ${BRAND_COLORS.violet}33`,
        }}
        styles={{ body: { padding: 40 } }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title
            level={2}
            style={{
              color: BRAND_COLORS.violet,
              marginBottom: 4,
              letterSpacing: 3,
            }}
          >
            UNJYNX
          </Title>
          <Text type="secondary">Enterprise Admin Portal</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <Form<LoginFormValues>
          layout="vertical"
          onFinish={handleEmailLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="admin@unjynx.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              style={{
                background: BRAND_COLORS.violet,
                height: 44,
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>
            OR
          </Text>
        </Divider>

        <Button
          icon={<SafetyOutlined />}
          onClick={handleSSOLogin}
          block
          size="large"
          style={{ height: 44 }}
        >
          Sign in with SSO (Logto)
        </Button>

        <Paragraph
          type="secondary"
          style={{ textAlign: "center", marginTop: 24, fontSize: 12 }}
        >
          MFA-enabled accounts will be prompted for verification after login.
        </Paragraph>
      </Card>
    </div>
  );
};
