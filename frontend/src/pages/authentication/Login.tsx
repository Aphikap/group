import { useState } from "react";
import { Button, Card, Form, Input, message, Row, Col, Typography } from "antd";
import type { LoginRequest } from "../../../interfaces/Login";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function LoginForm() {
    const navigate = useNavigate();
    const { Title, Text } = Typography;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8080/api/login", values, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data?.token) {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("username", res.data.username || values.username);
                localStorage.setItem("id", String(res.data.payload.id));

                // โชว์ข้อความแล้วค่อย navigate (ไม่ต้อง setTimeout)
                messageApi.success({
                    content: "Login success!",
                    duration: 1.2,
                    onClose: () => navigate("/product-list"), // <-- เปลี่ยน path ให้ตรง route ของคุณ
                });
            } else {
                messageApi.error("Unexpected response from server");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Login failed";
            messageApi.error(msg);
        } finally {
            setLoading(false);
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
                    padding: 16,
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
                                    Sign In
                                </Title>
                                <Text type="secondary">Access your account</Text>
                            </Col>

                            <Col span={24}>
                                <Form<LoginRequest>
                                    name="login"
                                    onFinish={onFinish}
                                    autoComplete="off"
                                    layout="vertical"
                                    size="large"
                                >
                                    <Form.Item
                                        label="Username or Email"
                                        name="username"
                                        rules={[{ required: true, message: "Please input your username or email!" }]}
                                    >
                                        <Input placeholder="Enter your username or email" />
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
                                            loading={loading}
                                            style={{
                                                width: "100%",
                                                height: 48,
                                                fontSize: 16,
                                                borderRadius: 8,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                border: "none",
                                            }}
                                        >
                                            Sign In
                                        </Button>

                                        <Button
                                            type="default"
                                            block
                                            style={{
                                                marginTop: 12,
                                                width: "100%",
                                                height: 48,
                                                fontSize: 16,
                                                borderRadius: 8,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                border: "none",
                                            }}
                                            onClick={() => navigate("/register")}  // ให้ path ตรงกับ router ของคุณ
                                        >
                                            Register
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
