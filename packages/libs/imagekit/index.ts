import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey: "public_lA1OPWeZS6YDOIjfEMMw36G4IjU=",
    privateKey: "private_3vqM9R/o1llOGeEk5i8cCnPRKd0=",
    // publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    // privateKey: process.env.IMAGEKIT_SECRET_KEY,
    urlEndpoint: "https://ik.imagekit.io/kamaleshsarkar",
});