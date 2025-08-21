import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Image } from 'antd';
import type { UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';

interface UploadLogoProps {
  onFileChange: (file: RcFile | null) => void; // ส่งไฟล์ขึ้น parent (ยังไม่อัปโหลด)
}

const UploadLogo: React.FC<UploadLogoProps> = ({ onFileChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // ตรงนี้แค่เก็บไฟล์ไว้ใน state และส่งไฟล์กลับ parent
  const beforeUpload = (file: RcFile) => {
    setFileList([{
      uid: file.uid,
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file), // แสดง preview ทันที
      originFileObj: file,
    }]);
    onFileChange(file); // ส่งไฟล์กลับ parent เพื่อเก็บไว้ใน state
    return false; // ป้องกัน auto upload ของ antd
  };

  const handleRemove = () => {
    setFileList([]);
    onFileChange(null);
    setPreviewImage('');
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        onPreview={handlePreview}
        accept="image/*"
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Logo</div>
          </div>
        )}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadLogo;
