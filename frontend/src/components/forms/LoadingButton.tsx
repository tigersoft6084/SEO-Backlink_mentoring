export default function LoadingButton() {
    return (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-center space-x-3">
            {/* Tailwind Spinner */}
            <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"
                role="status">
            </div>

            {/* Animated Gradient Text */}
            <div className="loader"></div>
        </div>

        {/* CSS Styles for Animation */}
        <style jsx>{`
            .loader {
                width: fit-content;
                font-weight: bold;
                font-family: monospace;
                font-size: 18px;
                color: #0000;
                background: linear-gradient(90deg, #3B82F6 calc(50% + 0.5ch), #A855F7 0) right / calc(200% + 1ch) 100%;
                -webkit-background-clip: text;
                background-clip: text;
                animation: l7 2s infinite steps(11);
            }

            .loader:before {
                content: "Loading...";
            }

            @keyframes l7 {
                to {
                    background-position: left;
                }
            }
        `}</style>
    </div>
    );
}
