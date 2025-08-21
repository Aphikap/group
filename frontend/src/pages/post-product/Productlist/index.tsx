
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Productlist.css'
import { useState } from "react";
function ProductList() {
   const products = [
      { src: "/img1.jpg", description: "สินค้า A", price: "100 บาท" },
      { src: "/img2.jpg", description: "สินค้า B", price: "150 บาท" },
      { src: "/img3.jpg", description: "สินค้า C", price: "200 บาท" },
      { src: "/img4.jpg", description: "สินค้า D", price: "300 บาท" },
      { src: "/img5.png", description: "สินค้า E", price: "180 บาท" },
      { src: "/img6.png", description: "สินค้า F", price: "250 บาท" },
      { src: "/img7.png", description: "สินค้า G", price: "220 บาท" },
      { src: "/img8.png", description: "สินค้า H", price: "310 บาท" },
   ];
   const categories = ["ทั้งหมด", "ผู้หญิง", "ผู้ชาย", "แฟชั่น"];
   const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");


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
                  {products.map((product, idx) => (
                     <div className='image' key={idx}>
                        <img
                           src={product.src}
                           alt={`image-${idx}`}
                           style={{
                              width: "184px",
                              height: "184px",
                              objectFit: "cover",
                              border: "1px solid black",
                           }}
                        />
                        <br />
                        <p>{product.description}</p>


                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <p style={{ margin: 0 }}>{product.price}</p>
                           <ShoppingCartOutlined />
                        </div>
                     </div>
                  ))}

               </div>
            </section>
         </div>
      </>
   );



}

export default ProductList