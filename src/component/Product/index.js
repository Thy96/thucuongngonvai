import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import images from "../../assets/images";

import { AlertAddCart } from "../ToastAlert";
import { ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';

import * as cateListID from "../../api-service/categoryServices";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from "@mui/material/Tabs";

import LazyLoad from 'react-lazyload'

const cx = classNames.bind(styles);

function Product({ loading, items, handleAdd }) {
  const { t } = useTranslation()

  const [sortItem, setSortItem] = useState(items);
  const [inputSearch, setInputSearch] = useState("");
  const [filters, setFilters] = useState("default");
  const [filterSearchProduct, setFilterSearchProduct] = useState(items);
  const [message, setMessage] = useState('');

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryID, setCategoryID] = useState(1)

  // Xử lý Select option tăng giảm giá
  const sortMethods = {
    default: { method: (a, b) => (a.id > b.id ? 1 : -1) }, // Chọn giá mặc định ban đầu
    descending: { method: (a, b) => a.price - b.price }, // Chọn giá giảm dần
    ascending: { method: (a, b) => b.price - a.price }, // Chọn giá tăng dần
  };

  function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
  }

  // Xử lý tìm kiếm sản phẩm
  const handleSearchProducts = (e) => {
    const textReg = e.target.value;
    setInputSearch(e.target.value);
    setMessage("")
    sortItem.concat(sortItem)
    const newData = sortItem.filter(item => {
      const itemData = `${removeVietnameseTones(item.name.toLowerCase())}`;
      return itemData.indexOf(removeVietnameseTones(textReg.toLowerCase())) > -1;
    });
    if (textReg.length > 0) {
      if (newData.length > 0) {
        setFilterSearchProduct(newData);
      } else {
        setFilterSearchProduct([]);
        setMessage('Không có sản phẩm!!!')
      }
    } else {
      setFilterSearchProduct(sortItem)
    }
  };

  // Xử lý Tablist cho sản phẩm
  const handleChangeCateID = async (cate_ID, key) => {
    if (key === 'tab') {
      try {
        const result = await cateListID.cateListID(cate_ID)
        if (result) {
          setSortItem(result);
          setFilterSearchProduct(result);
          setCategoryID(cate_ID);
          setCurrentPage(currentPage)
          setInputSearch("")
        }
      } catch (error) {

      }
    }
  };

  // Xử lý Phân Trang cho sản phẩm
  // const handleChangePage = async (currentPage) => {
  //   // const result = await axios.get(`https://shop.thomas-dave.store/api?storeId=${categoryID}&page=${currentPage}`);
  //   const result = await pagesServices.pages(categoryID, currentPage)
  //   if (result) {
  //     // setSortItem(result?.data.data.products.data);
  //     setSortItem(result?.data);
  //     setCurrentPage(currentPage);
  //   }
  // };

  useEffect(() => {
    setFilterSearchProduct(items)
  }, [items]); // Items được gán giá trị khi component Mount

  return (
    <>
      {loading ? (
        <div>
          <img src={images.loading} alt="loading" />
        </div>
      ) : (
        <>
          <div
            className="flex"
            style={{
              marginTop: "50px",
              padding: "30px 15px",
              borderTop: "1px solid #eee",
              borderBottom: "1px solid #eee",
            }}
          >
            <p
              style={{
                marginBottom: "0",
                marginRight: "10px",
                fontSize: "20px",
              }}
            >
              {t('homepage.search')}:
            </p>
            <input
              value={inputSearch}
              onChange={handleSearchProducts}
              placeholder={t('homepage.searchPlaceholder')}
              className="field__input"
            />
            <p
              style={{
                marginBottom: "0",
                marginRight: "10px",
                marginLeft: "30px",
                fontSize: "20px",
              }}
            >
              {t('homepage.sort')}:
            </p>
            <select
              className="field__select"
              onChange={(e) => setFilters(e.target.value)}
            >
              <option value="default">{t('homepage.sortDefault')}</option>
              <option value="ascending">{t('homepage.sortASC')}</option>
              <option value="descending">{t('homepage.sortDESC')}</option>
            </select>
          </div>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={categoryID?.toString()}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={categoryID} onChange={(e, newValue) => handleChangeCateID(newValue, 'tab')}>
                  <Tab label="Bà Ba" value={1} />
                  <Tab label="Bà Tư" value={2} />
                  <Tab label="Bà Năm" value={3} />
                </Tabs>
              </Box>
            </TabContext>
          </Box>

          <div className="list-product">
            {filterSearchProduct
              .sort(sortMethods[filters].method)
              .map((item) => (
                <LazyLoad className="product-card" debounce={100} height={200} key={item.id} placeholder={<img src={images.loading} alt="loading" />}>
                  <div className="img-wrap">
                    <img src={item.get_image.url} alt="" />
                  </div>
                  <div className="product-card-content">
                    <div className="product-title">{item.name}</div>
                    <div className="product-price">
                      <div className="product-origin-price">
                        {item.price.toLocaleString()}đ
                      </div>
                    </div>
                    <div onClick={() => handleAdd(item)}>
                      <AlertAddCart></AlertAddCart>
                    </div>
                  </div>
                </LazyLoad>

              ))}

            {message}
          </div>

          <ToastContainer />
          {/* <div className={cx("pagination-pro")}>
            <Paginator
              totalRecords={sortItem.length}
              pageLimit={5}
              pageNeighbours={2}
              setOffset={setOffset}
              currentPage={currentPage}
              setCurrentPage={handleChangePage}
              pagePrevText="..."
              pageNextText="..."
            />
          </div> */}
        </>
      )
      }
    </>
  );
}

export default Product;
