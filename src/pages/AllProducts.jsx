import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AllProducts.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

function AllProducts() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [discountOnly, setDiscountOnly] = useState(false);
    const [sort, setSort] = useState("default");

    useEffect(() => {
        axios
            .get("http://localhost:3333/products/all")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error loading products:", error);
            });
    }, []);

    const getDiscount = (price, discountPrice) => {
        return Math.round(((price - discountPrice) / price) * 100);
    };

    const filteredProducts = products
        .filter((product) => {
            const currentPrice = product.discont_price ?? product.price;

            const matchesMin =
                minPrice === "" || currentPrice >= Number(minPrice);

            const matchesMax =
                maxPrice === "" || currentPrice <= Number(maxPrice);

            const matchesDiscount =
                !discountOnly || product.discont_price != null;

            return matchesMin && matchesMax && matchesDiscount;
        })
        .sort((a, b) => {
            const priceA = a.discont_price ?? a.price;
            const priceB = b.discont_price ?? b.price;

            if (sort === "low-high") {
                return priceA - priceB;
            }

            if (sort === "high-low") {
                return priceB - priceA;
            }

            if (sort === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            return 0;
        });

    return (
        <main className="allProductsPage">
            <h1>All products</h1>

            <div className="productsFilters">
                <div className="priceFilter">
                    <span>Price</span>

                    <input
                        type="number"
                        placeholder="from"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="to"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>

                <label className="discountFilter">
                    <span>Discounted items</span>
                    <input
                        type="checkbox"
                        checked={discountOnly}
                        onChange={(e) => setDiscountOnly(e.target.checked)}
                    />
                </label>

                <div className="sortFilter">
                    <span>Sorted</span>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="default">by default</option>
                        <option value="newest">newest</option>
                        <option value="high-low">price: high-low</option>
                        <option value="low-high">price: low-high</option>
                    </select>
                </div>
            </div>

            <div className="productsGrid">
                {filteredProducts.map((product) => {
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
                        <Link
                            to={`/products/${product.id}`}
                            className="productCard"
                            key={product.id}
                        >
                            <div className="productImageWrapper">
                                <img
                                    src={`http://localhost:3333${product.image}`}
                                    alt={product.title}
                                    className="productImage"
                                />

                                <button
                                    className="productAddButton"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dispatch(addToCart(product));
                                    }}
                                >
                                    Add to cart
                                </button>

                                {hasDiscount && (
                                    <span className="discountBadge">
                                        -{discountPercent}%
                                    </span>
                                )}
                            </div>

                            <p className="productTitle">{product.title}</p>

                            <div className="productPrices">
                                <span className="currentPrice">
                                    ${currentPrice}
                                </span>

                                {hasDiscount && (
                                    <span className="oldPrice">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}

export default AllProducts;