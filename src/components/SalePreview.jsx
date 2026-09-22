import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import "./SalePreview.css";

function SalePreview() {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get("http://localhost:3333/products/all")
            .then((response) => {
                const discountedProducts = response.data
                    .filter((product) => product.discont_price !== null)
                    .slice(0, 4);

                setProducts(discountedProducts);
            })
            .catch((error) => {
                console.error("Error loading sale products:", error);
            });
    }, []);

    const getDiscount = (price, discountPrice) => {
        return Math.round(((price - discountPrice) / price) * 100);
    };

    return (
        <section className="salePreview">
            <div className="saleHeader">
                <h2>Sale</h2>

                <Link to="/sales" className="allSalesLink">
                    All sales
                </Link>
            </div>

            <div className="saleGrid">
                {products.map((product) => (
                    <Link
                        to={`/products/${product.id}`}
                        className="saleCard"
                        key={product.id}
                    >
                        <div className="saleImageWrapper">
                            <img
                                src={`http://localhost:3333${product.image}`}
                                alt={product.title}
                                className="saleImage"
                            />

                            <button
                                className="addToCartButton"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dispatch(addToCart(product));
                                }}
                            >
                                Add to cart
                            </button>

                            <span className="discountBadge">
                                -{getDiscount(product.price, product.discont_price)}%
                            </span>
                        </div>

                        <p className="saleTitle">{product.title}</p>

                        <div className="salePrices">
                            <span className="salePrice">
                                ${product.discont_price}
                            </span>

                            <span className="oldPrice">
                                ${product.price}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default SalePreview;