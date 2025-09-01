import React, { useState } from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import useEcomStore from '../../../store/ecom-store';

type Props = {
    filteredProducts: any[];
};
const Cardlistproduct = ({ filteredProducts }: Props) => {
    const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart)
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    return (
        <div className="image-grid">
            {filteredProducts.map((product, idx) => {
                const imageUrl = `http://localhost:8080${product?.Product?.ProductImage?.[0]?.image_path}`;
                const name = product?.Product?.name || "ไม่มีชื่อสินค้า";
                const desciption = product?.Product?.description || "ไม่มีคำอธิบาย";
                const price = product?.Product?.price || 0;
                const quantity = product?.Product?.quantity || 0;
                const sellerId = product?.Seller?.ID;
                const logoUrl = product?.Seller?.ShopProfile?.logo_path
                    ? `http://localhost:8080${product?.Seller?.ShopProfile?.logo_path}`
                    : null;
                const shopName = product?.Seller?.ShopProfile?.shop_name || "ไม่ทราบชื่อร้าน";

                return (
                    <div className="image" key={idx}>
                        {/* ✅ รูปสินค้า */}
                        <img
                            src={imageUrl}
                            alt={`product-${idx}`}
                            style={{
                                width: "184px",
                                height: "184px",
                                objectFit: "cover",
                                border: "1px solid black",
                            }}
                        />
                        {/* ✅ โลโก้ร้านค้า */}
                        {logoUrl && sellerId && (
                            <Link
                                to={`/shop/${sellerId}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    textDecoration: "none",
                                    color: "#0c0909ff", // สีตัวอักษรปกติ
                                }}
                            >
                                <img
                                    src={logoUrl}
                                    alt="shop-logo"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "1px solid #ccc",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <span
                                    style={{
                                        color: "#0c0909ff",
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        transition: "color 0.2s ease",
                                    }}
                                    className="shop-name"
                                >
                                    <h5>ชื่อร้านค้า :{shopName}</h5>
                                </span>
                            </Link>
                        )}



                        <p>ชื่อสินค้า :{name}</p>
                        <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "#555" }}>
                            คำอธิบาย: {desciption}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <p style={{ margin: 0 }}>ราคา: {price} บาท</p>


                            <div style={{ display: "flex", gap: 8 }}>

                                <Button size="small" icon={<ShoppingCartOutlined />} onClick={() => {
                                    showDrawer();
                                    actionAddtoCart(product);
                                }}>

                                </Button>
                            </div>
                        </div>

                        <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "#555" }}>
                            คงเหลือ: {quantity}
                        </p>
                    </div>
                );
            })}
            <Drawer
                title="ตะกร้าสินค้า"
                open={open}
                onClose={onClose}
                mask={false}
                placement="right"
                width={360}
            >
                <div className="cart-drawer">
                    <div className="cart-item">
                        <div className="cart-item-image">No Image</div>

                        <div className="cart-item-details">
                            <h4>Title</h4>
                            <p>Description</p>
                            <div className="cart-item-qty">
                                <button>- </button>
                                <span>1</span>
                                <button>+</button>
                            </div>
                        </div>

                        <div className="cart-item-price">
                            <div className="price">1,000</div>
                            <div className="remove">🗑️</div>
                        </div>
                    </div>

                    <div className="cart-total">
                        <span>รวม</span>
                        <span>5,000</span>
                    </div>

                    <button className="cart-checkout-btn">ดำเนินการชำระเงิน</button>
                </div>
            </Drawer>
        </div>
    )
}

export default Cardlistproduct
