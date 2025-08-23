import Uploadimage from './Uploadimage';
import { Divider, Checkbox, Col, Row, Button, Form, Input, message, Radio } from 'antd';
import { ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import './index.css'
import { useForm } from 'antd/es/form/Form';
import type { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import axios from 'axios';
import type { PostProductPayload } from '../../../interfaces/PostProductPayload';
import useEcomStore from '../../store/ecom-store';


function PostProduct() {
    const [form] = useForm();
    const seller = useEcomStore((state: any) => state.user); // ดึง seller
    const seller_id = seller?.id;
    const [files, setFiles] = useState<RcFile[]>([]); // ⬅️ เก็บรูปไว้ก่อน

    const handleFileSelect = (selectedFiles: RcFile[]) => {
        setFiles(selectedFiles);
    };

    const onFinish = async (values: Omit<PostProductPayload, 'images'>) => {
        if (!seller_id) {
            message.error('ไม่พบผู้ขาย (seller_id)');
            return;
        }
        if (files.length === 0) {
            message.error('กรุณาอัปโหลดภาพอย่างน้อย 1 รูป');
            return;
        }

        try {
            // 1) อัปโหลดหลายไฟล์ครั้งเดียว → key ต้องชื่อ 'files'
            const fd = new FormData();
            files.forEach(f => fd.append('files', f));

            const up = await axios.post(
                'http://localhost:8080/api/upload-Product', // ตรงกับ routes.go
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const imageUrls: string[] = up.data?.urls || [];

            // 2) เตรียม payload ให้ครบ type และแปลง number ให้ชัวร์
            const payload: PostProductPayload = {
                product_name: values.product_name,
                description: values.description,
                price: Number(values.price),
                quantity: Number(values.quantity),
                category_id: Number((values as any).category_id ?? (values as any).category), // เผื่อชื่อฟิลด์ยังเป็น category
                seller_id: Number(seller_id),
                images: imageUrls,
            };

            console.log('ส่ง:', payload);
            await axios.post('http://localhost:8080/api/post-Product', payload);

            message.success('บันทึกสำเร็จ');
            form.resetFields();
            setFiles([]);
        } catch (err: any) {
            console.log('UPLOAD/POST ERR:', err.response?.data || err.message);
            message.error(err.response?.data?.error || 'อัปโหลดหรือบันทึกล้มเหลว');
        }
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

                                    name="upload_images"
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
                                        <Uploadimage onFileSelect={handleFileSelect} />
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
                                            name="category_id" // เปลี่ยนจาก category
                                            rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่สินค้า' }]}
                                        >
                                            <Radio.Group>
                                                <Row>
                                                    <Col span={12}><Radio value={1}>เสื้อผ้าแฟชั่น</Radio></Col>
                                                    <Col span={12}><Radio value={2}>อิเล็กทรอนิก</Radio></Col>
                                                    <Col span={12}><Radio value={3}>อาหาร</Radio></Col>
                                                    <Col span={12}><Radio value={4}>ของใช้จำเป็น</Radio></Col>
                                                    <Col span={12}><Radio value={5}>เกมมิ่งเกียร์</Radio></Col>
                                                </Row>
                                            </Radio.Group>
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
