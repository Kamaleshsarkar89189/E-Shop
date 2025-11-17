export const enhancements = [
    // --- Premium (paid plan) ---
    // { label: "Remove BG", effect: "e-removedotbg", premium: true },
    // { label: "Drop Shadow", effect: "e-dropshadow", premium: true },
    // { label: "Retouch", effect: "e-retouch", premium: true },
    // { label: "Upscale", effect: "e-upscale", premium: true },

    // --- Free Transformations ---
    // Resize
    { label: "Resize Width 400", effect: "w-400", premium: false },
    { label: "Resize Height 300", effect: "h-300", premium: false },
    { label: "Resize 400x300 (Maintain Ratio)", effect: "w-400,h-300,c-maintain_ratio", premium: false },
    { label: "Crop to Max", effect: "c-at_max", premium: false },
    { label: "Crop Exact", effect: "cm-extract", premium: false },
    { label: "Pad Exact Size", effect: "cm-pad", premium: false },

    // Quality & Format
    { label: "Quality 80%", effect: "q-80", premium: false },
    { label: "Auto Format (WebP/AVIF)", effect: "f-auto", premium: false },
    { label: "Force JPG", effect: "f-jpg", premium: false },
    { label: "Force PNG", effect: "f-png", premium: false },

    // Rotation & Flip
    { label: "Rotate 90°", effect: "rt-90", premium: false },
    { label: "Rotate 180°", effect: "rt-180", premium: false },
    { label: "Rotate 270°", effect: "rt-270", premium: false },
    { label: "Flip Vertically", effect: "rt-flip", premium: false },
    { label: "Flip Horizontally", effect: "rt-flop", premium: false },

    // Focus / Smart Crop
    { label: "Focus Center", effect: "fo-center", premium: false },
    { label: "Focus Top", effect: "fo-top", premium: false },
    { label: "Focus Bottom", effect: "fo-bottom", premium: false },
    { label: "Focus Left", effect: "fo-left", premium: false },
    { label: "Focus Right", effect: "fo-right", premium: false },
    { label: "Focus Face", effect: "fo-face", premium: false },

    // Color / Filters
    { label: "Grayscale", effect: "e-grayscale", premium: false },
    { label: "Invert Colors", effect: "e-invert", premium: false },
    { label: "Blur (10)", effect: "e-blur,10", premium: false },
    { label: "Brightness 120%", effect: "e-brightness,120", premium: false },
    { label: "Contrast 120%", effect: "e-contrast,120", premium: false },

    // Background / Padding
    { label: "Background Black", effect: "bg-000000", premium: false },
    { label: "Pad with White", effect: "cm-pad,bg-FFFFFF", premium: false },
];
