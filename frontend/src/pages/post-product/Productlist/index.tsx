
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Productlist.css'
import { useEffect, useState } from "react";
import { getAllproducts } from '../../../api/auth';
function ProductList() {

   const [products, setProducts] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
   const categories = ["ทั้งหมด", "ผู้หญิง", "ผู้ชาย", "แฟชั่น"];

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await getAllproducts();
            console.log(res);
            setProducts(res.data?.data || []);
         } catch (err) {
            console.error("โหลดสินค้าล้มเหลว:", err);
         }
      };
      fetchData();
   }, []);




   return (
      <>
         <div className='containerlist'>

            <nav>
               <ul style={{ display: "flex", gap: "16px", listStyle: "none", padding: 0 }}>
                  {categories.map((cat) => (
                     <li
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                           cursor: "pointer",
                           fontWeight: selectedCategory === cat ? "bold" : "normal",
                           borderBottom: selectedCategory === cat ? "2px solid black" : "none",
                           paddingBottom: "10px",
                        }}
                     >
                        {cat}
                     </li>
                  ))}
               </ul>
            </nav>
            <section>
               <div className="image-grid">
                  {products.map((product, idx) => {
                     const imageUrl = `http://localhost:8080${product?.Product?.ProductImage?.[0]?.image_path}`;



                     const name = product?.Product?.name || "ไม่มีชื่อสินค้า";
                     const price = product?.price || 0;
                     const quantity = product?.quantity || 0;

                     return (
                        <div className="image" key={idx}>
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
                           <br />
                           <p>{name}</p>

                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <p style={{ margin: 0 }}>{price} บาท</p>
                              <ShoppingCartOutlined />
                           </div>

                           <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "#555" }}>
                              คงเหลือ: {quantity}
                           </p>
                        </div>
                     );
                  })}
               </div>

            </section>
         </div>
      </>
   );



}

export default ProductList