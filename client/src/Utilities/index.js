/*import Logo from "./Logo.jsx";

export { Logo };*/

// This file will act as single source for importing all the modules/files of this folder and will hence used as a single source for exporting
import ToastMsg from "./ToastMsg";
import ScrollToTop from "./ScrollToTop";
import RotatingCloseButton from "./RotatingCloseButton";
import ConfirmationPopup from "./ConfirmationPopups/ConfirmationPopup";
import verifyUserToken from "./verifyAuthToken";
import Pagination from "./Pagination";
import ImageLoaderComponent from "./ImageLoaderComponent";

export {
  ToastMsg,
  ScrollToTop,
  RotatingCloseButton,
  ConfirmationPopup,
  verifyUserToken,
  Pagination,
  ImageLoaderComponent
};

// Helper Functions
export const processYouTubeUrl = (url) => {
  if (!url) return '';

  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  let videoId = '';

  // Process youtube.com/watch?v= format
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v');
  }
  // Process youtu.be/ format
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1];
  }

  // Remove any additional parameters
  videoId = videoId.split('&')[0];
  videoId = videoId.split('?')[0];

  if (!videoId) {
    console.error('Invalid YouTube URL:', url);
    return '';
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1];
};