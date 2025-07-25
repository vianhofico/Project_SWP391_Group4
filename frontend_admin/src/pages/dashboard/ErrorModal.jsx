function ErrorModal({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-sm text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
