/*import Logo from "./Logo.jsx";

export { Logo };*/

// This file will act as single source for importing all the modules/files of this folder and will hence used as a single source for exporting
import ToastMsg from "./ToastMsg";
import ScrollToTop from "./ScrollToTop";
import RotatingCloseButton from "./RotatingCloseButton";
import ConfirmationPopup from "./ConfirmationPopups/ConfirmationPopup";
import verifyUserToken from "./verifyAuthToken";
import Pagination from "./Pagination";

export {
  ToastMsg,
  ScrollToTop,
  RotatingCloseButton,
  ConfirmationPopup,
  verifyUserToken,
  Pagination
};

// Helper Functions
// For date comparison (only date, no time)
export const formatToIST = (date) => {
  const d = new Date(date);
  // Add IST offset (5 hours and 30 minutes)
  d.setHours(d.getHours() + 5, d.getMinutes() + 30);
  
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

// For displaying date and time
export const formatToISTWithTime = (date) => {
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Date(date).toLocaleString('en-IN', options);
};

// Helper to check if two dates are the same day in IST
export const isSameDayIST = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Convert both dates to IST
  d1.setHours(d1.getHours() + 5, d1.getMinutes() + 30);
  d2.setHours(d2.getHours() + 5, d2.getMinutes() + 30);
  
  return d1.toDateString() === d2.toDateString();
};