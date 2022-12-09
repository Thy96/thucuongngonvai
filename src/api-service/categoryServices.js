import axios from "axios";
// import * as request from "../utils/request";

// Get API pages
export const cateListID = async (cate_ID) => {
  try {
    const res = await axios.get(`https://shop.thomas-dave.store/api?storeId=${cate_ID}`)

    return res.data.data.products;
  } catch (error) {
    console.log(error);
    return error;
  }
};
