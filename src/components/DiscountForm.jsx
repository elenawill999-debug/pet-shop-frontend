import { useState } from "react";
import axios from "axios";
import "./DiscountForm.css";
import discountImage from "../assets/images/discount-pets.png";

function DiscountForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3333/sale/send", form);
            setSubmitted(true);
        } catch (error) {
            console.error("Error sending discount request:", error);
        }
    };

    return (
        <section className="discount">
            <div className="discountLeft">
                <h2>5% off on the first order</h2>

                <img
                    src={discountImage}
                    alt="Pets"
                    className="discountPets"
                />
            </div>

            <form className="discountForm" onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={submitted}>
                    {submitted ? "Request Submitted" : "Get a discount"}
                </button>
            </form>
        </section>
    );
}

export default DiscountForm;