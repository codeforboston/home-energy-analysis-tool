type PopupProps = {
    message: string;
    onClose: () => void;
};

export function ErrorPopup({ message, onClose }: PopupProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
                <p className="mb-4 text-red-600">{message}</p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={onClose}
                >
                    Okay
                </button>
            </div>
        </div>
    );
}
  