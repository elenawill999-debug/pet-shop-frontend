import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { addToCart } from "../features/cartSlice";
import "./Sales.css";

function Sales() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    axios
      .get("http://localhost:3333/products/all")
      .then((response) => {
        const discountedProducts = response.data.filter(
          (product) => product.discont_price != null
        );

        setProducts(discountedProducts);
      })
      .catch((error) => {
        console.error("Error loading sale products:", error);
      });
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const price = product.discont_price;

      const matchesMin =
        minPrice === "" || price >= Number(minPrice);

      const matchesMax =
        maxPrice === "" || price <= Number(maxPrice);

      return matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (sort === "low-high") {
        return a.discont_price - b.discont_price;
      }

      if (sort === "high-low") {
        return b.discont_price - a.discont_price;
      }

      if (sort === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return 0;
    });

  const getDiscount = (price, discountPrice) => {
    return Math.round(
      ((price - discountPrice) / price) * 100
    );
  };

  return (
    <main className="salesPage">
      <h1>Discounted items</h1>

      <div className="salesFilters">
        <div className="salesPriceFilter">
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

        <div className="salesSortFilter">
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

      <div className="salesGrid">
        {filteredProducts.map((product) => (
          <Link
            to={`/products/${product.id}`}
            className="salesCard"
            key={product.id}
          >
            <div className="salesImageWrapper">
              <img
                src={`http://localhost:3333${product.image}`}
                alt={product.title}
                className="salesImage"
              />

              <button
                className="salesAddButton"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dispatch(addToCart(product));
                }}
              >
                Add to cart
              </button>

              <span className="salesDiscount">
                -{getDiscount(
                  product.price,
                  product.discont_price
                )}
                %
              </span>
            </div>

            <p className="salesTitle">
              {product.title}
            </p>

            <div className="salesPrices">
              <strong>${product.discont_price}</strong>
              <span>${product.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Sales;