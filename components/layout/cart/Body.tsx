"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CartProductForm from "./ProductForm";
import Image from "next/image";
import Next from "@/public/next.svg";
import CartSkeleton from "./CartSkeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { CartResponseProps, ShopCartProps } from "@/types/cart";
import { cartBaseUrl, checkoutBaseUrl } from "@/types/globalVar";
import NoCart from "@/public/noCart.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkoutFromCartResponseProps } from "@/types/checkout";
import { AlertProps } from "@/types/alert";
import Alert from "../Alert";
import LoadingPopup from "../LoadingPopUp";
import { useAuth } from "@/hooks/auth/useAuth";

const CartBody = () => {
  const router = useRouter();
  const [shopCartItems, setShopCartItems] = useState<ShopCartProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  const [, setTotalProductInCart] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alertState, setAlertState] = useState<AlertProps>({
    isOpen: false,
    message: "",
    isWrong: true,
  });
  const hasSelectedItems = selectedCartIds.length > 0;
  const { customerId } = useAuth();

  const fetchCartData = async (customerId: string) => {
    try {
      const cartRes = await axios.get<CartResponseProps>(
        `${cartBaseUrl}/${customerId}`
      );
      const shops = cartRes.data.output_schema.shops;
      console.log("SHOPS:", shops);
      setShopCartItems(shops);
      setTotalProductInCart(cartRes.data.output_schema.total_product_cart);

      const storedCartIds = JSON.parse(
        localStorage.getItem("selectedCartIds") || "[]"
      );

      const allIds = shops.flatMap((shop) =>
        shop.carts.map((cart) => cart.cart_id)
      );
      const validCartIds = storedCartIds.filter((id: string) =>
        allIds.includes(id)
      );

      setSelectedCartIds(validCartIds);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCartData(customerId);
    }
  }, [customerId]);

  const handleRefresh = () => {
    if (customerId) {
      fetchCartData(customerId);
    }
  };

  useEffect(() => {
    if (!isInitialLoad && typeof window !== "undefined") {
      localStorage.setItem("selectedCartIds", JSON.stringify(selectedCartIds));
    }
  }, [selectedCartIds, isInitialLoad]);

  const allCartIds = shopCartItems.flatMap((shop) =>
    shop.carts
      .filter((cart) => cart.available_to_rent)
      .map((cart) => cart.cart_id)
  );

  const isAllSelected =
    allCartIds.length > 0 &&
    allCartIds.every((id) => selectedCartIds.includes(id));

  const selectedShopIds = shopCartItems
    .filter((shop) => {
      const availableCarts = shop.carts.filter(
        (cart) => cart.available_to_rent
      );

      return (
        availableCarts.length > 0 &&
        availableCarts.every((cart) => selectedCartIds.includes(cart.cart_id))
      );
    })
    .map((shop) => shop.shop_id);

  const handleSelectAll = (checked: boolean) => {
    const availableCartIds = shopCartItems.flatMap((shop) =>
      shop.carts
        .filter((cart) => cart.available_to_rent)
        .map((cart) => cart.cart_id)
    );

    setSelectedCartIds(checked ? availableCartIds : []);
  };

  const isAnyProductAvailableToChecked = () => {
    const availableCartIds = shopCartItems.flatMap((shop) =>
      shop.carts
        .filter((cart) => cart.available_to_rent)
        .map((cart) => cart.cart_id)
    );

    return availableCartIds.length > 0;
  };

  const handleShopSelect = (shopId: string, checked: boolean) => {
    const shop = shopCartItems.find((s) => s.shop_id === shopId);
    if (!shop) return;

    const availableShopCartIds = shop.carts
      .filter((cart) => cart.available_to_rent)
      .map((cart) => cart.cart_id);

    setSelectedCartIds((prev) =>
      checked
        ? [...new Set([...prev, ...availableShopCartIds])]
        : prev.filter((id) => !availableShopCartIds.includes(id))
    );
  };

  const handleProductSelect = (cartId: string, checked: boolean) => {
    setSelectedCartIds((prev) =>
      checked ? [...prev, cartId] : prev.filter((id) => id !== cartId)
    );
  };

  const handleDeleteCartItem = (deletedCartId: string) => {
    setSelectedCartIds((prev) => prev.filter((id) => id !== deletedCartId));
    setShopCartItems((prev) =>
      prev
        .map((shop) => ({
          ...shop,
          carts: shop.carts.filter((cart) => cart.cart_id !== deletedCartId),
        }))
        .filter((shop) => shop.carts.length > 0)
    );
  };

  const checkAllSelectedItemsValid = () => {
    const allErrorDateCartIds = shopCartItems
      .flatMap((shop) => shop.carts)
      .filter((cart) => cart.date_error)
      .map((cart) => cart.cart_id);

    const isValid = selectedCartIds.every(
      (id) => !allErrorDateCartIds.includes(id)
    );

    return isValid;
  };

  const handleCheckout = async () => {
    const isValid = checkAllSelectedItemsValid();
    if (!isValid) {
      setAlertState({
        isOpen: true,
        message: "Mohon perbaiki tanggal sewa produk yang kamu pilih!",
      });
      return;
    }

    const payload = {
      customer_id: customerId,
      cart_ids: selectedCartIds || "[]",
      shipping_partner_id: "JNE",
    };

    console.log(payload);
    setSubmitLoading(true);
    try {
      const res = await axios.post<checkoutFromCartResponseProps>(
        `${checkoutBaseUrl}/cart`,
        payload
      );

      if (res.data.error_schema.error_message === "SUCCESS") {
        localStorage.setItem(
          "transactionIds",
          JSON.stringify(res.data.output_schema.transaction_ids)
        );
        localStorage.removeItem("selectedCartIds");
        router.push("/checkout");
      }
    } catch (err) {
      setAlertState({
        isOpen: true,
        message: "Gagal Melakukan Checkout: " + err,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {submitLoading && <LoadingPopup />}
      {alertState.isOpen && (
        <Alert
          message={alertState.message}
          isOpen={alertState.isOpen}
          onClose={() =>
            setAlertState({ isOpen: false, message: "", isWrong: true })
          }
          isWrong={alertState.isWrong}
        />
      )}

      <div className="flex flex-col mx-auto w-full max-w-[1280px] min-h-screen h-auto p-2 pt-12 bg-color-layout">
        <h2 className="w-full text-xl md:text-2xl font-semibold text-color-primary">
          Keranjang Sewa
        </h2>

        {loading && <CartSkeleton />}

        {!loading && shopCartItems.length === 0 ? (
          <div className="flex flex-col space-y-6 w-full justify-center items-center py-20">
            <Image className="w-[500px] h-[372px]" src={NoCart} alt="noCart" />
            <h2 className="text-color-primary text-xl text-center font-medium">
              Keranjangmu masih kosong. Yuk tambah produk ke keranjang sekarang!
            </h2>
            <Button className="w-[200px] lg:w-[300px] mt-7 h-[50px] font-medium rounded-xl text-[12px] lg:text-[16px] xl:text[18px] bg-custom-gradient-tr hover:opacity-80">
              <Link href={"/"}>Kembali ke Dashboard</Link>
            </Button>
          </div>
        ) : (
          !loading &&
          shopCartItems.length > 0 && (
            <>
              {isAnyProductAvailableToChecked() && (
                <Card className="p-0 mt-4">
                  <CardHeader className="w-full flex space-x-4 items-center md:items-center pb-0 pl-[29px] pt-0 py-[14px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                    <h2 className="text-[16px] font-semibold text-color-primary pb-1">
                      Pilih Semua{" "}
                      <span className="font-light">
                        ({allCartIds.length || "0"})
                      </span>
                    </h2>
                  </CardHeader>
                </Card>
              )}

              <div className="flex flex-col w-full space-y-[18px] pb-8 mt-[18px]">
                {shopCartItems.map((item) => (
                  <CartProductForm
                    key={item.shop_id}
                    shopCart={item}
                    isSelected={selectedShopIds.includes(item.shop_id)}
                    selectedCartIds={selectedCartIds}
                    onShopSelect={handleShopSelect}
                    onProductSelect={handleProductSelect}
                    onDelete={handleDeleteCartItem}
                    onRefresh={handleRefresh}
                  />
                ))}
              </div>
              <Button
                disabled={!hasSelectedItems}
                onClick={() => {
                  handleCheckout();
                }}
                className={`flex self-center md:self-end space-x-[10px] w-full max-w-[200px] h-[48px] mt-8 mb-[210px] rounded-xl hover:opacity-80 bg-custom-gradient-tr ${
                  !hasSelectedItems ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Image src={Next} alt="next" className="w-5 h-5" />
                <h4 className="text-lg font-medium">Checkout</h4>
              </Button>
            </>
          )
        )}
      </div>
    </>
  );
};

export default CartBody;
