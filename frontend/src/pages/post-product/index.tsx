import Uploadimage from './Uploadimage';
import { Divider, Checkbox, Col, Row, Button, Form, Input, message } from 'antd';
import { ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import './index.css'
import { useForm } from 'antd/es/form/Form';

function PostProduct() {
    const [form] = useForm();


    const handleUploadSuccess = (urls: string[]) => {
        form.setFieldsValue({ image: urls });
    };

    const onFinish = (values: any) => {

        if (!values.image || values.image.length === 0) {
            message.error("กรุณาอัปโหลดภาพอย่างน้อย 1 รูป");
            return;
        }
        console.log("ส่งฟอร์มพร้อม:", values);
    };

    return (
        <>
           
            <div className="container">
               

                <div>
                    <div>
                        <div className="form">
                            <Form
                                form={form}
                                name="wrap"
                                labelCol={{ flex: '200px' }}
                                labelAlign="left"
                                labelWrap
                                wrapperCol={{ flex: 1 }}
                                colon={false}
                                style={{ maxWidth: 1000 }}
                                onFinish={onFinish}
                            >
                                <Form.Item

                                    name="image"
                                    style={{ marginLeft: '100px' }}
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value && value.length > 0
                                                    ? Promise.resolve()
                                                    : Promise.reject(new Error('กรุณาอัปโหลดภาพอย่างน้อย 1 รูป')),
                                        },
                                    ]}
                                >
                                    <div style={{ display: 'flex', marginRight: '0px' }}>
                                        <h4 style={{ marginRight: '15px' }}>ภาพสินค้า</h4>
                                        <Uploadimage onUploadSuccess={handleUploadSuccess} />
                                    </div>
                                </Form.Item>

                                <Form.Item noStyle>
                                    <Divider style={{ borderColor: 'black' }} />
                                </Form.Item>

                                <div className="Card1">
                                    <div style={{ paddingRight: '100px', paddingLeft: '100px' }}>
                                        <Form.Item label={<h4>ชื่อสินค้า</h4>} name="product_name" rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item label={<h4>ราคา</h4>} name="price" rules={[{ required: true, message: 'กรุณากรอกราคา' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item label={<h4>จำนวนสินค้า</h4>} name="quantity" rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item label={<h4>รายละเอียดสินค้า</h4>} name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
                                            <Input.TextArea rows={4} />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <Form.Item
                                            label={<h4>หมวดหมู่สินค้า</h4>}
                                            name="category"
                                            rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่สินค้า' }]}
                                        >
                                            <Checkbox.Group>
                                                <Row>
                                                    <Col span={12}><Checkbox value="A">เสื้อผ้าแฟชั่น</Checkbox></Col>
                                                    <Col span={12}><Checkbox value="B">อิเล็กทรอนิก</Checkbox></Col>
                                                    <Col span={12}><Checkbox value="C">อาหาร</Checkbox></Col>
                                                    <Col span={12}><Checkbox value="D">ของใช้จำเป็น</Checkbox></Col>
                                                    <Col span={12}><Checkbox value="E">เกมมิ่งเกียร์</Checkbox></Col>
                                                </Row>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </div>
                                </div>

                                <Form.Item label=" ">
                                    <Button icon={<UploadOutlined />} style={{ background: '#fe7e01', marginLeft: '230px' }}
                                        htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <section></section>
                    <footer></footer>
                </div>
            </div>
        </>
    );
}

export default PostProduct;
