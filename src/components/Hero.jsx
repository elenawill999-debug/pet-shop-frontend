import React from "react";
import heroImage from "../assets/images/02_head.jpg";
import "./Hero.css";

function Hero() {
    return (
        <section className="hero">
            <img
                src={heroImage}
                alt="Amazing Discounts on Pets Products"
                className="heroImage"
            />
        </section>
    );
}

export default Hero;