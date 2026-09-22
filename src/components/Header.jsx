import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/icons/logo.svg";
import basketEmpty from "../assets/icons/basket-empty.svg";

import "./Header.css";

function Header() {
    const cartItems = useSelector((state) => state.cart.items);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <header className="header">
            <Link to="/" className="logoLink">
                <img src={logo} alt="Pet Shop" className="logo" />
            </Link>

            <nav className="navigation">
                <Link to="/">Main Page</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/products">All products</Link>
                <Link to="/sales">All sales</Link>
            </nav>

            <Link to="/cart" className="cart">
                <img
                    src={basketEmpty}
                    alt="Shopping cart"
                    className="cartIcon"
                />

                {cartCount > 0 && (
                    <span className="cartCount">{cartCount}</span>
                )}
            </Link>
        </header>
    );
}

export default Header;