import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import classNames from "classnames/bind";
import styles from "./HistoryCart.module.scss";
import * as getOrderHistory from "../../api-service/ordersServices";

const cx = classNames.bind(styles);

function HistoryCart() {
  const { t } = useTranslation()
  const [orderHistory, setOrderHistory] = useState(() => {
    const store_newList = JSON.parse(localStorage.getItem("ListOrderID"));
    return store_newList ?? [0];
  });

  console.log(orderHistory);

  const getOrderList = async () => {
    const store_arrList = [];
    orderHistory?.map((item) => store_arrList.push(item));
    const result = await getOrderHistory.getOrderHistory(store_arrList);
    setOrderHistory(result);
  };

  useEffect(() => {
    getOrderList();
  }, []);

  const listProducts = orderHistory?.map((items) => {
    return items.get_order_items?.map((item) => {
      return (
        <dl key={item.id} className={cx("content-flex")}>
          <dd className={cx("content-flex-img")}>
            <img src={item.product_img_url} alt="" />
          </dd>
          <dd className={cx("content-flex-name")}>
            {item.product_name}
            <br />
            <hr></hr>
            <h6>{t('homepage.orderDate')}: {items.order_date}</h6>
          </dd>

          <dd className={cx("content-flex-qty")}>{item.qty}</dd>

          <dd className={cx("content-flex-price")}>
            {item.price.toLocaleString()}đ
          </dd>
        </dl>
      );
    });
  });

  return (
    <>
      <div className={cx("modal-pop-up")}>
        {listProducts?.length === 0 ? (
          <div>
            {listProducts?.length === 0 && (
              <div style={{ margin: 0, maxWidth: "100% !important" }}>
                {t('homepage.noteOrderHistory')}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={cx("left-info")}>
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                {t('homepage.orderHistory')}
              </h2>
              <div className={cx("content-width")}>
                <div className={cx("content-scroll")}>
                  <dl className={cx("content-flex")}>
                    <dt>{t('homepage.imageItem')}</dt>
                    <dt>{t('homepage.nameItem')}</dt>
                    <dt>{t('homepage.qtyItem')}</dt>
                    <dt>{t('homepage.priceItem')}</dt>
                  </dl>

                  {listProducts}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default HistoryCart;
