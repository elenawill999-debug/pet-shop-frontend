import Hero from "../components/Hero";
import CategoriesPreview from "../components/CategoriesPreview";
import DiscountForm from "../components/DiscountForm";
import SalePreview from "../components/SalePreview";

function Home() {
    return (
        <>
            <Hero />
            <CategoriesPreview />
            <DiscountForm />
            <SalePreview />
        </>
    );
}

export default Home;