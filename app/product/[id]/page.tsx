// ===== INI HALAMAN PRODUCT DETAIL ======
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductDetailBody from "@/components/layout/productDetail/Body";
const ProductDetail = () => {
  return (
    <>
      <Navbar type="product"/>
        <ProductDetailBody/>
      <Footer />
    </>
  );
};

export default ProductDetail;
