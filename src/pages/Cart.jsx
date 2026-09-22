import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from "../features/cartSlice";
import "./Cart.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Cart() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.discont_price ?? item.price;
        return total + price * item.quantity;
    }, 0);

    const onSubmit = async (data) => {
        const orderData = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            products: cartItems,
        };

        try {
            await axios.post(
                "http://localhost:3333/order/send",
                orderData
            );

            setOrderSuccess(true);
            reset();
            dispatch(clearCart());
        } catch (error) {
            console.error("Error sending order:", error);
        }
    };
    if (orderSuccess) {
        return (
            <div className="successOverlay">
                <div className="successModal">
                    <button
                        className="successClose"
                        onClick={() => setOrderSuccess(false)}
                    >
                        ×
                    </button>

                    <h2>Congratulations!</h2>

                    <p>
                        Your order has been successfully placed
                        on the website.
                    </p>

                    <p>
                        A manager will contact you shortly
                        to confirm your order.
                    </p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="cartPage">
                <div className="cartTop">
                    <h1>Shopping cart</h1>
                    <Link to="/products">Back to the store</Link>
                </div>

                <div className="emptyCart">
                    <p>Looks like you have no items in your basket currently.</p>

                    <Link to="/products" className="continueShopping">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cartPage">
            <div className="cartTop">
                <h1>Shopping cart</h1>

                <Link to="/products">
                    Back to the store
                </Link>
            </div>

            <div className="cartLayout">
                <div className="cartItems">
                    {cartItems.map((item) => {
                        const currentPrice =
                            item.discont_price ?? item.price;

                        return (
                            <div className="cartItem" key={item.id}>
                                <img
                                    src={`http://localhost:3333${item.image}`}
                                    alt={item.title}
                                    className="cartItemImage"
                                />

                                <div className="cartItemInfo">
                                    <p className="cartItemTitle">
                                        {item.title}
                                    </p>

                                    <div className="cartQuantity">
                                        <button
                                            onClick={() =>
                                                dispatch(decreaseQuantity(item.id))
                                            }
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                dispatch(increaseQuantity(item.id))
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="cartItemPrice">
                                    <strong>
                                        ${currentPrice * item.quantity}
                                    </strong>

                                    {item.discont_price != null && (
                                        <span>
                                            ${item.price * item.quantity}
                                        </span>
                                    )}
                                </div>

                                <button
                                    className="removeCartItem"
                                    onClick={() =>
                                        dispatch(removeFromCart(item.id))
                                    }
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>

                <aside className="orderDetails">
                    <h2>Order details</h2>

                    <p className="orderItems">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>

                    <div className="orderTotal">
                        <span>Total</span>
                        <strong>${totalPrice}</strong>
                    </div>

                    <form
                        className="orderForm"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <span className="formError">
                                {errors.name.message}
                            </span>
                        )}

                        <input
                            type="tel"
                            placeholder="Phone number"
                            {...register("phone", {
                                required: "Phone number is required",
                            })}
                        />
                        {errors.phone && (
                            <span className="formError">
                                {errors.phone.message}
                            </span>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        {errors.email && (
                            <span className="formError">
                                {errors.email.message}
                            </span>
                        )}

                        <button type="submit">
                            Order
                        </button>
                    </form>
                </aside>
            </div>
        </main>
    );
}

export default Cart;