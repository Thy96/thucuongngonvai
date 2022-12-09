import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/common.css";
import "./assets/css/home.css";
import DefaultLayout from "./layout/DefaultLayout";
import * as cateListID from "./api-service/categoryServices";

function App() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Tăng số lượng Item
  const handleAdd = (product_id) => {
    const exist = cartItems.find((x) => x.id === product_id.id);
    if (exist) {
      const newCartItems = cartItems.map((x) =>
        x.id === product_id.id ? { ...exist, qty: exist.qty + 1 } : x
      );
      setCartItems(newCartItems);
    } else {
      const newCartItems = [...cartItems, { ...product_id, qty: 1 }];
      setCartItems(newCartItems);
    }
  };

  // Giảm số lượng Item
  const handleRemove = (product_id) => {
    const exist = cartItems.find((x) => x.id === product_id.id);
    if (exist.qty === 1) {
      const newCartItems = cartItems.filter((x) => x.id !== product_id.id);
      setCartItems(newCartItems);
    } else {
      const newCartItems = cartItems.map((x) =>
        x.id === product_id.id ? { ...exist, qty: exist.qty - 1 } : x
      );
      setCartItems(newCartItems);
    }
  };

  // Xóa từng Item trong Cart
  const handleDeleted = (product_id) => {
    setCartItems(cartItems.filter((item) => item.id !== product_id));
  };

  // Xóa toàn bộ Item trong Cart
  const handleClear = (product_id) => {
    setCartItems(
      cartItems.filter(
        (item) => item.id === product_id && item.id !== product_id
      )
    );
  };

  useEffect(() => {
    // Get API
    const fetchAPI = async () => {
      const result = await cateListID.cateListID(1);
      setItems(result);
      setLoading(false);
    };

    fetchAPI();
  }, [cartItems]); // cartItems -> Sau mỗi lần thêm Item thì cập nhập lại initialStateValue

  return (
    <>
      <DefaultLayout
        loading={loading}
        items={items}
        cartItems={cartItems}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleDeleted={handleDeleted}
        handleClear={handleClear}
      ></DefaultLayout>
    </>
  );
}

export default App;
