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
        </div>
    );
}
