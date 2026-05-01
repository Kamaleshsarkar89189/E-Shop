import express, { Router } from "express";
import { createDiscountCodes, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, followShop, getAllEvents, getAllProducts, getCategories, getDiscountCodes, getFilteredEvents, getFilteredProducts, getFilteredShops, getProductById, getProductDetails, getSellerProducts, getShopById, getShopProducts, getShopProductsWithDates, getShopProfile, isFollowingShop, restoreProduct, searchProducts, topShops, unfollowShop, updateProduct, uploadProductImage } from "../controllers/product.controller";
import isAuthenticated from "packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.get("/get-categories", getCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCodes)
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes)
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode)
router.post("/upload-product-image", isAuthenticated, uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.post("/create-product", isAuthenticated, createProduct);
router.get("/get-shop-products", isAuthenticated, getShopProducts);
router.delete("/delete-product/:productId", isAuthenticated, deleteProduct);
router.put("/restore-product/:productId", isAuthenticated, restoreProduct);
router.get("/get-all-products", getAllProducts)
router.get("/get-all-events", getAllEvents)
router.get("/get-product/:slug", getProductDetails)
router.get("/get-filtered-products", getFilteredProducts);
router.get("/get-filtered-offers", getFilteredEvents);
router.get("/get-filtered-shops", getFilteredShops);
router.get("/search-products", searchProducts);
router.get("/top-shops", topShops);
router.get("/get-shop/:id", getShopById);
router.get(
    "/get-seller-products/:shopId",
    getSellerProducts
);
router.get(
    "/get-seller-events/:shopId",
    getShopProductsWithDates
);
router.get(
    "/is-following/:shopId",
    isFollowingShop
);
router.post("/follow-shop", followShop);
router.post("/unfollow-shop", unfollowShop);
router.get("/shop-profile/:sellerId", getShopProfile);

router.put('/update-product/:id', updateProduct);
router.get('/get-product/:id', getProductById);

export default router;