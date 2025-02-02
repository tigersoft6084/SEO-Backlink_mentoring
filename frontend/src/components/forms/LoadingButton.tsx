export default function LoadingButton({content} : {content : string}) {
    return (
        <div className="flex flex-col items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl">
            <div className="flex items-center space-x-3">
                {/* Tailwind Spinner */}
                <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"
                    role="status">
                </div>

                {/* Animated Gradient Text */}
                <div className="loader">{content}...</div>
            </div>

            {/* CSS Styles for Animation */}
            <style jsx>{`
                .loader {
                    width: fit-content;
                    font-weight: bold;
                    font-family: monospace;
                    font-size: 18px;
                    color: #0000;
                    background: linear-gradient(90deg, white calc(50% + 0.5ch), #c0c0c0 0) right / calc(200% + 1ch) 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: l7 2s infinite steps(11);
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
