import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CategoriesPreview.css";

const API_URL = "http://localhost:3333";

function CategoriesPreview() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/categories/all`)
            .then((response) => {
                setCategories(response.data.slice(0, 4));
            })
            .catch((error) => {
                console.error("Error loading categories:", error);
            });
    }, []);

    return (
        <section className="categoriesPreview">
            <div className="categoriesTitle">
                <h2>Categories</h2>

                <Link to="/categories" className="allCategories">
                    All categories
                </Link>
            </div>

            <div className="categoriesGrid">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/categories/${category.id}`}
                        className="categoryCard"
                    >
                        <img
                            src={`${API_URL}${category.image}`}
                            alt={category.title}
                        />

                        <p>{category.title}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default CategoriesPreview;