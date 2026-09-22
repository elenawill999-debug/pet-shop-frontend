import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Categories.css";

function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3333/categories/all")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error loading categories:", error);
            });
    }, []);

    return (
        <main className="categoriesPage">
            <h1>Categories</h1>

            <div className="categoriesGrid">
                {categories.map((category) => (
                    <Link
                        to={`/categories/${category.id}`}
                        className="categoryCard"
                        key={category.id}
                    >
                        <div className="categoryImageWrapper">
                            <img
                                src={`http://localhost:3333${category.image}`}
                                alt={category.title}
                                className="categoryImage"
                            />
                        </div>

                        <p>{category.title}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}

export default Categories;