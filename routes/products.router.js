const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../schemas/products.schema");

// 상품 목록 조회
router.get("/products", async (req, res) => {
  const products = await Product.find()
    .select("title author status createdAt")
    .sort({ createdAt: -1 });
  res.status(200).json({
    data: products,
  });
});

// 상품 상세 조회
router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  try {
    const product = await Product.findOne({ _id: productId }).select(
      "title author content status createdAt"
    );

    if (!product) {
      return res.status(404).json({
        message: "상품 조회에 실패하였습니다.",
      });
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 내부 오류가 발생하였습니다.",
    });
  }
});

// 상품 등록
router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;

  if (!title || !content || !author || !password) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  await Product.create({
    title,
    content,
    author,
    password,
  });

  res.json({
    message: "판매 상품을 등록하였습니다.",
  });
});

// 상품 정보 수정
router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;

  // productId의 유효성 검사
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  // body 필드들의 유효성 검사
  if (!title || !content || !password || !status) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  const product = await Product.findOne({ _id: productId });

  // 상품이 존재하지 않을 경우
  if (!product) {
    return res.status(404).json({
      message: "상품 조회에 실패하였습니다.",
    });
  }

  // 비밀번호가 일치하지 않을 경우
  if (product.password !== Number(password)) {
    return res.status(401).json({
      message: "상품을 수정할 권한이 존재하지 않습니다.",
    });
  }

  // 상품 정보 업데이트
  try {
    await Product.updateOne(
      {
        _id: productId,
      },
      {
        $set: {
          title,
          content,
          password,
          status,
        },
      }
    );

    res.status(200).json({
      message: "상품 정보가 성공적으로 수정되었습니다.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "서버 내부 오류가 발생하였습니다.",
    });
  }
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  // productId의 유효성 검사
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  // body 필드들의 유효성 검사
  if (!password) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  const product = await Product.findOne({ _id: productId });

  // 상품이 존재하지 않을 경우
  if (!product) {
    return res.status(404).json({
      message: "상품 조회에 실패하였습니다.",
    });
  }

  // 비밀번호가 일치하지 않을 경우
  if (product.password !== Number(password)) {
    return res.status(401).json({
      message: "상품을 삭제할 권한이 존재하지 않습니다.",
    });
  }

  await Product.deleteOne({ _id: product });

  res.status(200).json({
    message: "상품을 삭제하였습니다.",
  });
});

module.exports = router;
