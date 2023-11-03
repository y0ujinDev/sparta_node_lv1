const express = require("express");
const router = express.Router();

const Product = require("../schemas/products.schema");

// 상품 목록 조회
router.get("/products", async (req, res) => {
  const products = await Product.find().select(
    "title author status createdAt"
  );
  res.status(200).json({
    data: products,
  });
});

// 상품 상세 조회
router.get("/products/:productId", async (req, res) => {});

// 상품 등록
router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;

  const createdProducts = await Product.create({
    title,
    content,
    author,
    password,
  });

  res.json({
    message: "판매 상품을 등록하였습니다.",
  });
});

module.exports = router;

// {
//   "title":"아이폰15 MAX",
//   "content": "얼마 사용하지 않은 제품 팝니다.",
//   "author":"판매자",
//   "password":"1234"
// }
