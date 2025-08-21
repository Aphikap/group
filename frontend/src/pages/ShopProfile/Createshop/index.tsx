import { useState } from 'react';
import UploadLogo from './UploadLogo';
import { Divider, Col, Row, Button, Form, Input, message, Radio } from 'antd';
import { ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import './index.css';
import { useForm } from 'antd/es/form/Form';
import type { RcFile } from 'antd/es/upload';
import type { ShopProfilePayload } from '../../../../interfaces/ShopProfilePayload';


import axios from 'axios';

function ShopProfileForm() {
  const [form] = useForm();
  const [logoFile, setLogoFile] = useState<RcFile | null>(null);

  const onFinish = async (values: any) => {
    if (!logoFile) {
      message.error('กรุณาอัปโหลดภาพโลโก้');
      return;
    }

    try {

      const formData = new FormData();
      formData.append('file', logoFile);

      const res = await axios.post('http://localhost:8080/api/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = res.data.url;

      values.image = imageUrl;
      const payload: ShopProfilePayload = {
        shop_name: values.shop_name,
        slogan: values.slogan,
        shop_description: values.shop_description,
        logo_path: imageUrl,
        address: {
          address: values.address,
          sub_district: values.sub_district,
          district: values.district,
          province: values.province,
        },
        category_id: Number(values.shopCategoryID),  // เปลี่ยนชื่อเป็น category_id
        seller_id: 1,
      };


      console.log('ส่งฟอร์มพร้อม:', values);
      await axios.post('http://localhost:8080/api/shop-profiles', payload)

      message.success('ส่งฟอร์มสำเร็จ');
    } catch (error) {
      console.error('อัปโหลดโลโก้ล้มเหลว:', error);
      message.error('อัปโหลดโลโก้ไม่สำเร็จ');
    }
  };

  return (
    <>
      
      <div className="container">
        

        <Form
          form={form}
          name="wrap"
          labelAlign="right"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          colon={false}
          style={{ maxWidth: '1000px', margin: '0 auto' }}
          onFinish={onFinish}
        >

          <Form.Item
            label="โลโก้ร้าน"
            name="logo_path"
            rules={[{ required: true, message: 'กรุณาอัปโหลดภาพโลโก้' }]}
          >
            <UploadLogo
              onFileChange={(file) => {
                setLogoFile(file);
                form.setFieldsValue({ logo_path: file ? 'uploaded' : undefined });
              }}
            />
          </Form.Item>


          <Divider style={{ borderColor: 'black' }} />
          <div className='form2'>
            <div>
              <Form.Item
                label={<span style={{ fontSize: '16px' }}>ชื่อร้านค้า</span>}
                name="shop_name"
                rules={[{ required: true, message: 'กรุณากรอกชื่อร้านค้า' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16px' }}>สโลแกนร้านค้า</span>}
                name="slogan"
                rules={[{ required: true, message: 'กรุณากรอกราคา' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16px' }}>คำอธิบายร้านค้า</span>}
                name="shop_description"
                rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>


              <Form.Item
                label={<span style={{ fontSize: '16px' }}>หมวดหมู่ร้านค้า</span>}
                name="shopCategoryID"
                rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่ร้านค้า' }]}
              >
                <Radio.Group>
                  <Row gutter={[0, 8]}>
                    <Col span={12}><Radio value={1}>เสื้อผ้าแฟชั่น</Radio></Col>
                    <Col span={12}><Radio value={2}>อิเล็กทรอนิก</Radio></Col>
                    <Col span={12}><Radio value={3}>อาหาร</Radio></Col>
                    <Col span={12}><Radio value={4}>ของใช้จำเป็น</Radio></Col>
                    <Col span={12}><Radio value={5}>เกมมิ่งเกียร์</Radio></Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={<span style={{ fontSize: '16px' }}>ที่อยู่</span>}
                name="address"
                rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16px' }}>ตำบล/แขวง</span>}
                name="sub_district"
                rules={[{ required: true, message: 'กรุณากรอกตำบล/แขวง' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16px' }}>อำเภอ/เขต</span>}
                name="district"
                rules={[{ required: true, message: 'กรุณากรอกอำเภอ/เขต' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16px' }}>จังหวัด</span>}
                name="province"
                rules={[{ required: true, message: 'กรุณากรอกจังหวัด' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              icon={<UploadOutlined />}
              style={{ background: '#fe7e01', color: 'white' }}
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

    </>
  );
}

export default ShopProfileForm;
