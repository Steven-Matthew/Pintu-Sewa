import ProductOrderHistoryContent from "@/components/fragments/orderHistory/ProductOrderHistoryContent";
import ProductOrderHistoryHeader from "@/components/fragments/orderHistory/ProductOrderHistoryHeader";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { OrderHistoryProps } from "@/types/orderHistory";
import Link from "next/link";

const OrderStatusCard = ({
  orderHistoryProps,
}: {
  orderHistoryProps: OrderHistoryProps;
}) => {
  return (
    <Card className="w-full px-4 sm:px-5 py-3">
      <ProductOrderHistoryHeader status={orderHistoryProps.status} transaction_date={orderHistoryProps.transaction_date} reference_number={orderHistoryProps.reference_number} shop={orderHistoryProps.shop} />
      {orderHistoryProps.products != null && orderHistoryProps.products.map((product, index) => (
        <ProductOrderHistoryContent
          key={index}
          orderHistoryProduct={product}
        />
      ))}
      <CardFooter className="flex flex-col items-end sm:space-x-3 space-y-[14px] py-3 px-0 border-t border-t-[#D9D9D9] border-opacity-50">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-color-primary text-end">
            Total Harga
          </h2>
          <h4 className="text-base text-color-primaryDark font-semibold">
            Rp 4.000.000
          </h4>
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-[28px] sm:items-center">
          {" "}
          <Link
            href="/cart/checkout"
            className="text-xs sm:text-sm text-color-secondary font-medium hover:opacity-70"
          >
            Detail Transaksi
          </Link>
          <Button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-color-primary bg-transparent border border-color-primaryDark hover:bg-slate-200">
            Lacak Produk
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderStatusCard;
