const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../schemas/products.schema');

const INVALID_DATA = '데이터 형식이 올바르지 않습니다.';
const SERVER_ERROR = '서버 내부 오류가 발생하였습니다.';

// productId 유효성 검사 미들웨어
const checkProductId = (req, res, next) => {
  const { productId } = req.params;
  // productId가 없거나 mongoose의 ObjectId 형식이 아니라면 에러 반환
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: INVALID_DATA });
  }
  next();
};

// 에러 처리 간소화를 위한 미들웨어
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 상품 목록 조회
router.get(
  '/products',
  asyncHandler(async (req, res) => {
    // 모든 상품을 찾아서 응답으로 반환
    const products = await Product.find()
      .select('title author status createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json({
      data: products,
    });
  }),
);

// 상품 상세 조회
router.get(
  '/products/:productId',
  checkProductId,
  asyncHandler(async (req, res) => {
    // 특정 상품 찾아서 응답으로 반환
    const product = await Product.findOne({
      _id: req.params.productId,
    }).select('title author content status createdAt');
    if (!product) {
      return res.status(404).json({
        message: '상품 조회에 실패하였습니다.',
      });
    }
    res.status(200).json({
      data: product,
    });
  }),
);

// 상품 등록
router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const { title, content, author, password } = req.body;
    // 필요한 정보가 빠져있다면 에러 반환
    if (!title || !content || !author || !password) {
      return res.status(400).json({ message: INVALID_DATA });
    }
    // 새로운 상품 생성
    await Product.create({ title, content, author, password });
    res.json({ message: '판매 상품을 등록하였습니다.' });
  }),
);

// 상품 정보 수정
router.put(
  '/products/:productId',
  checkProductId,
  asyncHandler(async (req, res) => {
    const { title, content, password, status } = req.body;
    // 필요한 정보가 빠져있다면 에러 반환
    if (!title || !content || !password || !status) {
      return res.status(400).json({ message: INVALID_DATA });
    }
    // 수정할 상품 찾기
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    // 상품이 없거나, 비밀번호가 틀리면 에러 반환
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (product.password !== Number(password)) {
      return res.status(401).json({
        message: '상품을 수정할 권한이 존재하지 않습니다.',
      });
    }
    // 상품 정보 수정
    await Product.updateOne(
      { _id: req.params.productId },
      { $set: { title, content, password, status } },
    );
    res.status(200).json({ message: '상품 정보가 성공적으로 수정되었습니다.' });
  }),
);

// 상품 삭제
router.delete(
  '/products/:productId',
  checkProductId,
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    // 비밀번호가 없으면 에러 반환
    if (!password) {
      return res.status(400).json({ message: INVALID_DATA });
    }
    // 삭제할 상품 찾기
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    // 상품이 없거나, 비밀번호가 틀리면 에러 반환
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (product.password !== Number(password)) {
      return res.status(401).json({
        message: '상품을 삭제할 권한이 존재하지 않습니다.',
      });
    }
    // 상품 삭제
    await Product.deleteOne({ _id: product });
    res.status(200).json({ message: '상품을 삭제하였습니다.' });
  }),
);

// 에러 처리 미들웨어
router.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.stack);
  res.status(500).json({ message: SERVER_ERROR });
});

module.exports = router;
