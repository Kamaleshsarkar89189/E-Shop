import { isAdmin, isSeller } from "@packages/middleware/authorizeRoles";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express";
import { addCategory, addNewAdmin, addSubCategory, getAllAdmins, getAllCustomizations, getAllEvents, getAllNotifications, getAllProducts, getAllSellers, getAllUsers, getSiteBanner, getSiteLogo, getUserNotifications, markNotificationAsRead, sellerNotifications, uploadSiteBanner, uploadSiteLogo } from "../controllers/admin.controller";

const router: Router = express.Router();

router.get("/get-all-products", isAuthenticated, isAdmin, getAllProducts)
router.get("/get-all-events", isAuthenticated, isAdmin, getAllEvents);
router.get("/get-all-admins", isAuthenticated, isAdmin, getAllAdmins);
router.put("/add-new-admin", isAuthenticated, isAdmin, addNewAdmin);
router.get('/get-all-users', isAuthenticated, isAdmin, getAllUsers);
router.get('/get-all-sellers', isAuthenticated, isAdmin, getAllSellers);
router.get("/get-all", getAllCustomizations);
router.get("/get-all-notifications", isAuthenticated, isAdmin, getAllNotifications);
router.get(
    "/get-user-notifications",
    isAuthenticated,
    getUserNotifications
);
router.post(
    "/mark-notification-as-read",
    isAuthenticated,
    markNotificationAsRead
);

router.get("/seller-notifications", isAuthenticated, isSeller, sellerNotifications);
router.post("/add-category", isAuthenticated, addCategory);
router.post("/add-subcategory", isAuthenticated, addSubCategory);
router.post("/upload-site-logo", isAuthenticated, uploadSiteLogo);
router.get("/get-site-logo", getSiteLogo);
router.post("/upload-site-banner", uploadSiteBanner);
router.get("/get-site-banner", getSiteBanner);


export default router;