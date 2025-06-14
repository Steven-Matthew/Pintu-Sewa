"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Google from "../../../public/google.jpg";
import RegisterImage from "../../../public/register.svg";
import LoginImage from "../../../public/login.svg";
import Link from "next/link";
// import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import LoadingPopup from "../LoadingPopUp";


interface AuthFormProps {
  type: "login" | "register";
  className?: string;
}

const AuthForm = ({ type, className }: AuthFormProps) => {
  const router = useRouter();

  const {
    emailOrPhone,
    password,
    isLoading,
    emailOrPhoneError,
    passwordError,
    authError,
    isChecked,
    inputRef,
    handleEmailOrPhoneChange,
    handlePasswordChange,
    handleCheckboxChange,
    handleSubmit,
    loginGoogleHandler
  } = useAuthForm(type);

  return (
    <div
      className={cn(
        "flex justify-center w-full h-full max-w-[1280px] max-h-[780px] mx-auto",
        className
      )}
    >
      <Card className="w-full flex p-1 md:p-5 rounded-3xl">
        <div className="hidden lg:block lg:w-1/2 self-center">
          <Image
            src={type === "login" ? LoginImage : RegisterImage}
            width={450}
            height={350}
            alt="auth"
            className="justify-self-center object-contain"
          />
        </div>

        <div className="w-full lg:w-1/2">
          <CardHeader className="flex-col">
            <CardTitle className="text-[22px] lg:text-[24px] xl:text-[28px] text-color-primaryDark font-semibold">
              {type === "login" ? "Masuk ke Pintu Sewa" : "Daftar Dulu Yuk!"}
            </CardTitle>
            <CardDescription className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[20px] text-color-primary">
              {type === "login"
                ? "Nikmati Kemudahan Sewa Barang"
                : "Langkah Awal Untuk Kemudahan Sewa"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 mb-5">
                <div className="grid gap-1 xs:gap-2">
                  <Label
                    htmlFor="email"
                    className={`${
                      emailOrPhoneError ? "text-red-500" : ""
                    } text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4`}
                  >
                    Email
                  </Label>
                  <Input
                    ref={inputRef}
                    className={cn(
                      "h-[50px] xs:h-[54px] md:h-[48px] text-[13px] xs:text-[14px] sm:text-[15px] md:text-[14px] lg:text-[16px]",
                      "text-color-grayPrimary font-normal border-2 rounded-xl focus:ring-2 p-6",
                      emailOrPhoneError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-color-primaryDark"
                    )}
                    id="email"
                    type="text"
                    placeholder="email@siapsewa.co.id"
                    value={emailOrPhone}
                    onChange={handleEmailOrPhoneChange}
                  />
                  {emailOrPhoneError && (
                    <p className="text-red-500 text-[10px] lg:text-[12px] xl:text-[14px] mt-1">
                      {emailOrPhoneError}
                    </p>
                  )}
                </div>
                {type === "register" ? (
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      onCheckedChange={handleCheckboxChange}
                      id="terms"
                    />
                    <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[16px] leading-none">
                      Saya menyetujui{" "}
                      <span
                        onClick={() => router.push("/terms-and-conditions")}
                        className="font-bold cursor-pointer hover:opacity-75"
                      >
                        syarat
                      </span>{" "}
                      dan{" "}
                      <span
                        onClick={() => router.push("/terms-and-conditions")}
                        className="font-bold cursor-pointer hover:opacity-75"
                      >
                        ketentuan
                      </span>{" "}
                      Pintu Sewa
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <Label
                      htmlFor="password"
                      className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4"
                    >
                      <div className="flex justify-between p-1">
                        <h4
                          className={`${
                            passwordError ? "text-red-500" : ""
                          } text-color-primary text-[12px] lg:text-[14px] xl:text-[16px]`}
                        >
                          Password
                        </h4>
                        <Link href={"/input-email-otp"}>
                          <h4 className="text-color-primaryDark font-bold hover:opacity-70 text-[12px] lg:text-[14px] xl:text-[16px]">
                            Lupa Password?
                          </h4>
                        </Link>
                      </div>
                    </Label>
                    <Input
                      className={cn(
                        "h-[50px] xs:h-[54px] md:h-[48px] text-[12px] lg:text-[14px] xl:text-[16px]",
                        "text-color-grayPrimary font-normal border-2 rounded-xl focus:ring-2 p-6",
                        passwordError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-400 focus:ring-color-primaryDark"
                      )}
                      id="password"
                      type="password"
                      placeholder="*********************"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {passwordError && (
                      <p className="text-red-500 text-[10px] lg:text-[12px] xl:text-[14px] mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                )}
                {isLoading && (
                  <LoadingPopup message="Sedang Memproses Data Anda..." />
                )}
                {authError && (
                  <p className="text-red-500 text-[12px] xs:text-[13px] sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[16px] mt-1">
                    {authError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full h-[50px] xs:h-[54px] md:h-[48px] rounded-xl mt-3 text-[14px] xs:text-[15px] sm:text-[16px] md:text-[15px] lg:text-[17px] xl:text-[18px] bg-custom-gradient-tr hover:opacity-80"
                  disabled={(type === "register" && !isChecked) || isLoading}
                >
                  {type === "login" ? "Masuk" : "Selanjutnya"}
                </Button>
              </div>
            </form>
            <div className="my-3 flex justify-center xl:justify-start space-x-2 items-center">
              <hr className="hidden xl:block w-1/3 border-t border-gray-500" />
              <h4 className="my-3 text-xs xl:text-[14px] text-gray-500 text-center w-1/3">
                atau masuk dengan
              </h4>
              <hr className="hidden xl:block w-1/3 border-t border-gray-500" />
            </div>
            <Button
              variant="outline"
              onClick={() =>
               loginGoogleHandler()
              }
              // onClick={() => router.push("/dev")}
              className="w-full mb-5 h-[50px] xs:h-[54px] md:h-[48px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Image
                width={20}
                height={20}
                src={Google}
                alt="Google Logo"
                className="w-5 h-5 xs:w-6 xs:h-6 md:w-5 md:h-5"
              />
              <span className="text-[13px] xs:text-[14px] sm:text-[15px] md:text-[14px] lg:text-[16px] xl:text-[17px] text-color-grayPrimary font-medium">
                Google
              </span>
            </Button>
            <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[12px] lg:text-[14px] xl:text-[15px] text-color-primary text-center">
              {type === "login" ? (
                <h4>
                  Belum Punya Akun?{" "}
                  <span className="text-color-primaryDark font-semibold hover:opacity-80">
                    <Link href="/register">Daftar Sekarang</Link>
                  </span>
                </h4>
              ) : (
                <h4>
                  Sudah Punya Akun?{" "}
                  <span className="text-color-primaryDark font-semibold hover:opacity-80">
                    <Link href="/login">Login</Link>
                  </span>
                </h4>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
