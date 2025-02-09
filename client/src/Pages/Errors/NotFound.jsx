import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="px-16 md:px-24 py-16 flex flex-col items-center justify-center text-center">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link className="text-blue-600 underline" to="/">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
