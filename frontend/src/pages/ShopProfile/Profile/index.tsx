import React from 'react';
import './ShopProfile.css';
import { Link } from "react-router-dom";

import { EditOutlined } from '@ant-design/icons';
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ShopProfileProps {
  shopName: string;
  slogan: string;
  description: string;
  logoUrl: string;
  categories: string[];
  products: Product[];
}

const ShopProfile: React.FC<ShopProfileProps> = ({
  shopName,
  slogan,
  description,
  logoUrl,
  categories,
  products,
}) => {
  return (
    <div className="shop-container">

      <div className="shop-header">
        <div className="shop-logo-box">
          <img src={logoUrl} alt="Shop Logo" className="shop-logo" />

        </div>
        <div className="shop-header-info">
          <h2 className="shop-name">{shopName}</h2>
          <p className="shop-slogan">{slogan}</p>
        </div>
        <div >
          edit <EditOutlined style={{ width: 50 }} />
        </div>
      </div>

      <div className='card5'>
        <div className="shop-section">
          <h3>เกี่ยวกับร้าน</h3>
          <p>{description}</p>
        </div>


        <div className="shop-section">
          <h3>หมวดหมู่สินค้า</h3>
          <div className="shop-categories">
            {categories.map((cat, index) => (
              <span key={index} className="shop-tag">
                {cat}
              </span>
            ))}
          </div>
          <br />
          <Link to="/create-post" className="btn-action">
            <h3>ลงประกาศขายสินค้า</h3>
          </Link>
        </div>

        <div className="shop-section" style={{ margin: '10px' }}><h3>ที่อยู่</h3></div>
      </div>


      <div className="shop-section">
        <h3>รายการสินค้าที่โพสต์</h3>
        {products.length === 0 ? (
          <p>ยังไม่มีสินค้าในร้านนี้</p>
        ) : (
          <div className="product-list" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '12px',
                  width: '200px',
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                  edit <EditOutlined style={{ width: 10 }} />
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <h4 style={{ marginTop: '8px', marginBottom: '4px' }}>{product.name}</h4>
                <p style={{ fontSize: '14px', color: '#555' }}>{product.category}</p>
                <p style={{ color: '#fe7e01', fontWeight: 'bold' }}>{product.price} บาท</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfile;
