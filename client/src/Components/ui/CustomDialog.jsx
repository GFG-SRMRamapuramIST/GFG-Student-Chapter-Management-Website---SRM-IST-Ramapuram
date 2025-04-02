import { RotatingCloseButton } from "../../Utilities";

const CustomDialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 my-6 max-h-[80vh] overflow-y-auto">
        <div className="absolute right-3 sm:right-4 top-3 sm:top-4">
          <RotatingCloseButton onClick={onClose} />
        </div>
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default CustomDialog;