import { motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

const RotatingCloseButton = ({ 
  onClick, 
  color = "text-gray-500",
  className = "" 
}) => {
  return (
    <motion.button
      whileHover={{ rotate: 90 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 rounded-xl ${className}`}
    >
      <RiCloseLine className={`w-5 h-5 ${color}`} />
    </motion.button>
  );
};

export default RotatingCloseButton;