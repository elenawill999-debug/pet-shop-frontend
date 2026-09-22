import { Link } from "react-router-dom";
import notFoundImage from "../assets/images/02_404.jpg";
import "./NotFound.css";

function NotFound() {
    return (
        <main className="notFoundPage">
            <img
                src={notFoundImage}
                alt="404 Page Not Found"
                className="notFoundImage"
            />

            <h1>Page Not Found</h1>

            <p>
                We're sorry, the page you requested could not be found.
                Please go back to the homepage.
            </p>

            <Link to="/" className="goHomeButton">
                Go Home
            </Link>
        </main>
    );
}

export default NotFound;