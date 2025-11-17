import React from "react";

interface GoogleButtonProps {
    onClick?: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
            <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95h146.9c-6.3 34-25 62.8-53.5 82l86.6 67.2c50.6-46.6 81.5-115.3 81.5-194z"
                    fill="#4285f4"
                />
                <path
                    d="M272 544.3c72.9 0 134.1-24.1 178.8-65.5l-86.6-67.2c-24 16.1-54.6 25.5-92.2 25.5-70.8 0-130.8-47.8-152.3-112.1l-90.2 69.6c45.5 90 138.6 149.7 242.5 149.7z"
                    fill="#34a853"
                />
                <path
                    d="M119.7 324.9c-10.5-30.6-10.5-63.6 0-94.2l-90.2-69.6C4.2 203.8 0 240.2 0 272s4.2 68.2 29.5 110.9l90.2-69.6z"
                    fill="#fbbc04"
                />
                <path
                    d="M272 107.7c39.8 0 75.6 13.7 103.7 40.7l77.6-77.6C406.1 24.1 344.9 0 272 0 168.1 0 75 59.7 29.5 149.1l90.2 69.6c21.5-64.3 81.5-111 152.3-111z"
                    fill="#ea4335"
                />
            </svg>
            <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
    );
};

export default GoogleButton;
