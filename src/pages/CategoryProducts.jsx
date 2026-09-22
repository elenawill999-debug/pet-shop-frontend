import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryProducts.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

function CategoryProducts() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [discountOnly, setDiscountOnly] = useState(false);
    const [sort, setSort] = useState("default");

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3333/categories/all"),
            axios.get("http://localhost:3333/products/all"),
        ])
            .then(([categoriesResponse, productsResponse]) => {
                const currentCategory = categoriesResponse.data.find(
                    (item) => item.id === Number(id)
                );

                const categoryProducts = productsResponse.data.filter(
                    (product) => product.categoryId === Number(id)
                );

                setCategory(currentCategory);
                setProducts(categoryProducts);
            })
            .catch((error) => {
                console.error("Error loading category:", error);
            });
    }, [id]);

    const filteredProducts = products
        .filter((product) => {
            const currentPrice =
                product.discont_price ?? product.price;

            const matchesMin =
                minPrice === "" ||
                currentPrice >= Number(minPrice);

            const matchesMax =
                maxPrice === "" ||
                currentPrice <= Number(maxPrice);

            const matchesDiscount =
                !discountOnly ||
                product.discont_price != null;

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

    if (!category) {
        return <main className="categoryProductsPage">Loading...</main>;
    }

    return (
        <main className="categoryProductsPage">
            <div className="categoryBreadcrumbs">
                <Link to="/">Main page</Link>
                <span>›</span>
                <Link to="/categories">Categories</Link>
                <span>›</span>
                <span>{category.title}</span>
            </div>

            <h1>{category.title}</h1>

            <div className="categoryFilters">
                <div className="categoryPriceFilter">
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

                <label className="categoryDiscountFilter">
                    <span>Discounted items</span>

                    <input
                        type="checkbox"
                        checked={discountOnly}
                        onChange={(e) => setDiscountOnly(e.target.checked)}
                    />
                </label>

                <div className="categorySortFilter">
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

            <div className="categoryProductsGrid">
                {filteredProducts.map((product) => {
                    const hasDiscount =
                        product.discont_price !== null &&
                        product.discont_price !== undefined;

                    const currentPrice = hasDiscount
                        ? product.discont_price
                        : product.price;

                    const discountPercent = hasDiscount
                        ? Math.round(
                            ((product.price - product.discont_price) /
                                product.price) *
                            100
                        )
                        : null;

                    return (
                        <Link
                            to={`/products/${product.id}`}
                            className="categoryProductCard"
                            key={product.id}
                        >
                            <div className="categoryProductImageWrapper">
                                <img
                                    src={`http://localhost:3333${product.image}`}
                                    alt={product.title}
                                />

                                <button
                                    className="categoryAddButton"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dispatch(addToCart(product));
                                    }}
                                >
                                    Add to cart
                                </button>

                                {hasDiscount && (
                                    <span className="categoryDiscount">
                                        -{discountPercent}%
                                    </span>
                                )}
                            </div>

                            <p>{product.title}</p>

                            <div className="categoryPrices">
                                <strong>${currentPrice}</strong>

                                {hasDiscount && (
                                    <span>${product.price}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}

export default CategoryProducts;