import { Button, Card, Form, Input, message, Row, Col, Typography } from "antd";
import type { RegisterRequest } from "../../../interfaces/Register";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
export default function RegisterForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterRequest) => {
    const payload: RegisterRequest = {
      username: values.username,
      password: values.password,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const seller = data?.seller;
      if (!seller) {
        messageApi.error(data?.message || "Unexpected response");
        return;
      }

      messageApi.success({
        content: `Register success! Welcome ${seller.username}`,
        duration: 1.2,
        onClose: () => navigate("/"), // หรือ "/product-list"
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error: cannot register";
      messageApi.error(msg);
    }
  };



  return (
    <>
      {contextHolder}
      <Row
        align="middle"
        justify="center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Col>
          <Card
            style={{
              width: 500,
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Row align="middle" justify="center" style={{ padding: "20px 0" }}>
              <Col span={24} style={{ textAlign: "center", marginBottom: 20 }}>
                <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                  Registration
                </Title>
                <Text type="secondary">Create your account</Text>
              </Col>

              <Col span={24}>
                <Form
                  name="register"
                  onFinish={onFinish}
                  autoComplete="off"
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please input your username!" }]}
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>


                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                  >
                    <Input.Password placeholder="Enter your password" />
                  </Form.Item>



                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: "100%",
                        height: 48,
                        fontSize: 16,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      Create Account
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}
