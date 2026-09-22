import "./Footer.css";

import instagramIcon from "../assets/icons/ic-instagram.svg";
import whatsappIcon from "../assets/icons/ic-whatsapp.svg";
import mapImage from "../assets/images/map.jpg";

function Footer() {
    return (
        <footer className="footer">
            <h2>Contact</h2>

            <div className="footerInfo">
                <div className="footerItem">
                    <span className="footerLabel">Phone</span>
                    <div className="footerValue">+49 30 915-88492</div>
                </div>

                <div className="footerItem">
                    <span className="footerLabel">Socials</span>

                    <div className="socials">
                        <img src={instagramIcon} alt="Instagram" />
                        <img src={whatsappIcon} alt="WhatsApp" />
                    </div>
                </div>

                <div className="footerItem">
                    <span className="footerLabel">Address</span>
                    <div className="footerValue">
                        Wallstraße 9-13, 10179 Berlin,
                        <br />
                        Deutschland
                    </div>
                </div>

                <div className="footerItem">
                    <span className="footerLabel">Working Hours</span>
                    <div className="footerValue">24 hours a day</div>
                </div>
            </div>

            <img
                className="footerMap"
                src={mapImage}
                alt="Store location"
            />
        </footer>
    );
}

export default Footer;