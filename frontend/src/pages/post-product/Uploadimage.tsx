import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Image, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';

interface UploadImageProps {
  onUploadSuccess: (urls: string[]) => void; // ✅ เปลี่ยนเป็น array
}

const UploadImage: React.FC<UploadImageProps> = ({ onUploadSuccess }) => {
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
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const url = data.url;

      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: url,
      };

      const updatedList = [...fileList, newFile];
      setFileList(updatedList);

      // ✅ ส่ง URL ของทุกภาพกลับไป
      onUploadSuccess(updatedList.map((f) => f.url!));

      message.success('อัปโหลดสำเร็จ');
    } catch (err) {
      message.error('อัปโหลดไม่สำเร็จ');
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={(file) => {
          handleUpload(file);
          return false; // ❌ ไม่ให้ auto-upload
        }}
        onRemove={(file) => {
          const updated = fileList.filter((f) => f.uid !== file.uid);
          setFileList(updated);

          // ✅ ส่ง URL ที่เหลือกลับไป
          onUploadSuccess(updated.map((f) => f.url!));
        }}
        onPreview={handlePreview}
        onChange={handleChange}
        accept="image/*"
      >
        {uploadButton}
      </Upload>

      {/* Preview image in lightbox */}
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

export default UploadImage;
