import express, { Router } from "express";
import { addUserAddress, createShop, createStripeConnectLink, deleteUserAddress, getAdmin, getLayoutData, getSeller, getUser, getUserAddresses, loginAdmin, loginSeller, loginUser, logoutAdmin, logoutSeller, logoutUser, refreshToken, registerSeller, resetSellerPassword, resetUserPassword, sellerForgotPassword, updateUserPassword, userForgotPassword, userRegistration, verifySeller, verifySellerForgotPassword, verifyUser, verifyUserForgotPassword } from "../controllers/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/forgot-password-seller", sellerForgotPassword);
router.post("/reset-password-seller", resetSellerPassword);
router.post("/verify-forgot-password-seller", verifySellerForgotPassword);
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/create-stripe-link", createStripeConnectLink);
router.post("/login-seller", loginSeller);
router.get("/logged-in-seller", isAuthenticated, isSeller, getSeller);
router.post("/change-password", isAuthenticated, updateUserPassword)
router.get("/shipping-addresses", isAuthenticated, getUserAddresses);
router.post("/add-address", isAuthenticated, addUserAddress);
router.delete("/delete-address/:addressId", isAuthenticated, deleteUserAddress);
router.post("/login-admin", loginAdmin);
router.get("/logged-in-admin", isAuthenticated, getAdmin);
router.get("/get-layouts", getLayoutData);
router.post("/logout-user", logoutUser);
router.post("/logout-admin", logoutAdmin);
router.post("/logout-seller", logoutSeller);



export default router;
