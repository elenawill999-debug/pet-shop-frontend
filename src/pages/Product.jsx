import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios
            .get("http://localhost:3333/products/all")
            .then((response) => {
                const foundProduct = response.data.find(
                    (item) => item.id === Number(id)
                );

                setProduct(foundProduct);
            })
            .catch((error) => {
                console.error("Error loading product:", error);
            });
    }, [id]);

    if (!product) {
        return <main className="productPage">Loading...</main>;
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(product));
        }
    };

    const hasDiscount =
        product.discont_price !== null &&
        product.discont_price !== undefined;

    const currentPrice = hasDiscount
        ? product.discont_price
        : product.price;

    const discountPercent = hasDiscount
        ? Math.round(
            ((product.price - product.discont_price) / product.price) * 100
        )
        : null;

    return (
        <main className="productPage">
            <div className="productBreadcrumbs">
                <Link to="/">Main page</Link>
                <span>›</span>
                <Link to="/products">All products</Link>
                <span>›</span>
                <span>{product.title}</span>
            </div>

            <div className="productDetails">
                <div className="productMainImage">
                    <img
                        src={`http://localhost:3333${product.image}`}
                        alt={product.title}
                    />
                </div>

                <div className="productInfo">
                    <h1>{product.title}</h1>

                    <div className="productPagePrices">
                        <span className="productPagePrice">
                            ${currentPrice}
                        </span>

                        {hasDiscount && (
                            <>
                                <span className="productPageOldPrice">
                                    ${product.price}
                                </span>

                                <span className="productPageDiscount">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    <div className="productActions">
                        <div className="quantityControl">
                            <button type="button" onClick={decreaseQuantity}>
                                −
                            </button>

                            <span>{quantity}</span>

                            <button type="button" onClick={increaseQuantity}>
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className="productPageAddButton"
                            onClick={handleAddToCart}
                        >
                            Add to cart
                        </button>
                    </div>

                    <h3>Description</h3>
                    <p className="productDescription">
                        {product.description}
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Product;