"use client";

import Image from "next/image";
import CalendarImage from "@/public/calendar.svg";
import { format } from "date-fns";
import NextSymbol from "@/public/next.svg";
import Cart from "@/public/cart.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ProductDetailProps } from "@/types/productDetail";
import { formatToRupiah } from "@/hooks/useConvertRupiah";

const RentForm = ({ productDetail }: { productDetail: ProductDetailProps }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset jam biar hanya bandingin tanggal

  const [startDate, setStartDate] = useState<Date | undefined>(
    () => new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [qty, setQty] = useState<number>(1);
  const max = productDetail.stock;

  function handleDecreaseQty() {
    if (qty > 1) setQty(qty - 1);
  }

  function handleIncreaseQty() {
    if (qty < max) setQty(qty + 1);
  }

  function calculateTotal() {
    if (!startDate || !endDate) return 0;

    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    const days = diffInDays < 1 ? 1 : diffInDays;

    let total = 0;

    if (days % 30 === 0) {
      const months = days / 30;
      total = productDetail.monthly_price * months * qty;
    } else if (days % 7 === 0) {
      const weeks = days / 7;
      total = productDetail.weekly_price * weeks * qty;
    } else {
      total = productDetail.daily_price * days * qty;
    }

    return formatToRupiah(total);
  }

  const handleSelectStartDate = (date: Date | undefined) => {
    if (!date) return;

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      alert("Tanggal mulai tidak boleh sebelum hari ini");
      return;
    }

    if (endDate && selected > endDate) {
      alert("Tanggal mulai tidak boleh setelah tanggal selesai");
      return;
    }

    setStartDate(selected);
  };

  const handleSelectEndDate = (date: Date | undefined) => {
    if (!date) return;

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      alert("Tanggal selesai tidak boleh sebelum hari ini");
      return;
    }

    if (startDate && selected < startDate) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai");
      return;
    }

    setEndDate(selected);
  };
  
  return (
    <div className="flex flex-col mt-[15px] md:mt-[60px] xl:max-w-[400px] xl:w-full pt-3 lg:pt-7 pb-4 xl:pb-[35px] px-3 xl:px-7 shadow-md outline-none bg-white">
      <h2 className="text-[14px] xl:text-[18px] text-color-primary font-medium">
        Formulir Penyewaan
      </h2>

      {/* PERIODE SEWA */}
      <div className="flex space-x-2 mt-[27px] items-center">
        <Image
          src={CalendarImage}
          alt="calendar"
          className="w-[11px] h-[12.22px]"
        />
        <h4 className="text-xs xl:text-sm text-color-primary font-medium">
          Periode Sewa
        </h4>
      </div>

      <div className="flex mt-[14px] space-x-[6px] items-center">
        {/* TANGGAL MULAI */}
        <div className="flex flex-col space-y-[6px]">
          <h4 className="text-[10px] xl:text-xs font-normal text-color-primary">
            Mulai
          </h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "w-[132px] justify-start text-left font-normal text-[12px] text-color-primary border-[1px] border-[#73787B] bg-transparent hover:bg-slate-200",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? (
                  format(startDate, "dd-MM-yyyy")
                ) : (
                  <span>Tanggal Mulai</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleSelectStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <h4 className="text-color-primary mt-5">-</h4>

        {/* TANGGAL SELESAI */}
        <div className="flex flex-col space-y-[6px]">
          <h4 className="text-[10px] xl:text-xs font-normal text-color-primary">
            Selesai
          </h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "w-[132px] justify-start text-left font-normal text-[12px] text-color-primary border-[1px] border-[#73787B] bg-transparent hover:bg-slate-200",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? (
                  format(endDate, "dd-MM-yyyy")
                ) : (
                  <span>Tanggal Selesai</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleSelectEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex flex-col mt-[14px] space-y-[4px]">
        <div className="flex flex-col space-y-[6px]">
          <h2 className="text-[12px] xl:text-sm font-medium text-color-primary">
            Quantity
          </h2>
          <div className="flex space-x-[7px] xl:space-x-6 px-2.5 xl:px-3 py-3 items-center border-[1px] border-[#73787B] bg-transparent w-full max-w-[60px] xl:max-w-[100px] h-[20px] rounded-sm">
            <button onClick={handleDecreaseQty} className="hover:opacity-75">
              -
            </button>
            <h4 className="block text-[12px] text-color-primary">{qty}</h4>
            <button
              onClick={handleIncreaseQty}
              className="mb-[2px] hover:opacity-75"
            >
              +
            </button>
          </div>
        </div>
        <h3 className="text-[8px] xl:text-[10px] text-color-grayPrimary font-normal">
          Max. sewa {productDetail.stock} buah
        </h3>
      </div>

      {/* SUBTOTAL */}
      <div className="flex justify-between items-center w-full mt-3">
        <h3 className="text-normal text-color-primary text-[12px] xl:text-[14px]">
          Subtotal
        </h3>
        <h2 className="text-lg xl:text-[20px] text-color-primaryDark font-bold">
          {calculateTotal()}
        </h2>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col mt-[14px] space-y-3">
        <Button className="w-full xl:h-[54px] hover:opacity-80 bg-custom-gradient-tr flex space-x-[9px]">
          <Image
            src={NextSymbol}
            alt="next-symbol"
            className="w-3 h-[14px] xl:w-5 xl:h-5"
          />
          <h4 className="text-[12px] xl:text-lg font-medium ">Selanjutnya</h4>
        </Button>
        <Button className="w-full xl:h-[54px] bg-transparent border-[1px] border-color-primaryDark hover:bg-slate-200  flex space-x-[9px]">
          <Image src={Cart} alt="cart" className="w-3 h-[14px] xl:w-5 xl:h-5" />
          <h4 className="text-[12px] xl:text-lg font-medium text-color-primaryDark">
            Keranjang
          </h4>
        </Button>
      </div>
    </div>
  );
};

export default RentForm;
