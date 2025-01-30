"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import PageImage from "../../../public/login.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useRef } from "react";

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

    if(!value.trim())return "Field ini tidak boleh kosong";
    else if (!passwordRegex.test(value) || value.length > 20) return "Password harus minimal 12 karakter dan maksimal 20 karakter, mengandung huruf besar, huruf kecil, dan angka.";
    
    return "";
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setConfirmPasswordError("");
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError("");
    setNewPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setNewPasswordError("");
    setConfirmPasswordError("");
  
    if (!newPassword.trim()) {
      setNewPasswordError("Password harus diisi.");
      return; 
    }
  
    const newPasswordValidationError = validatePassword(newPassword);
    if (newPasswordValidationError) {
      setNewPasswordError(newPasswordValidationError);
      return; 
    }
  
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Konfirmasi Password harus diisi.");
      return; 
    }
  
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Password tidak sama dengan diatas.");
      return; 
    }
  
    try {
      setIsLoading(true);
      console.log("Password berhasil direset:", newPassword);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during password reset:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div
      className={cn(
        "flex justify-center w-full h-full max-w-[1280px] max-h-[726px] mx-auto",
        className
      )}
    >
      <Card className="w-full h-[600px] flex justify-center items-center p-1 md:p-5 rounded-3xl">
        <div className="hidden md:block md:w-3/5 self-center">
          <Image
            src={PageImage}
            width={500}
            height={400}
            alt="auth"
            className="justify-self-center object-contain"
          />
        </div>

        <div className="w-full md:w-2/5">
          <CardHeader>
            <CardTitle className="text-[22px] lg:text-[24px] xl:text-[28px] text-color-primaryDark font-semibold">
              Reset Password
            </CardTitle>
            <CardDescription className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[20px] text-color-primary font-extralight font-sans">
              Yuk reset passwordmu biar bisa transaksi
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 mb-5">
                <div className="grid gap-1 xs:gap-2">
                  <Label
                    htmlFor="newPassword"
                    className={`${newPasswordError ? "text-red-500" : ""} text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4`}
                  >
                    Password Baru
                  </Label>
                  <Input
                    ref={inputRef}
                    className={cn(
                      "h-[50px] xs:h-[54px] md:h-[48px] text-[13px] xs:text-[14px] sm:text-[15px] md:text-[14px] lg:text-[16px]",
                      "text-color-grayPrimary font-normal border-2 rounded-xl focus:ring-2 p-6",
                      newPasswordError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-color-primaryDark"
                    )}
                    id="newPassword"
                    type="password"
                    placeholder="***********************"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  {newPasswordError && (
                    <p className="text-red-500 text-[10px] lg:text-[12px] xl:text-[14px] mt-1">
                      {newPasswordError}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 xs:gap-2">
                  <Label
                    htmlFor="confirmPassword"
                    className={`${confirmPasswordError ? "text-red-500" : ""} text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4`}
                  >
                    Konfirmasi Password
                  </Label>
                  <Input
                    className={cn(
                      "h-[50px] xs:h-[54px] md:h-[48px] text-[13px] xs:text-[14px] sm:text-[15px] md:text-[14px] lg:text-[16px]",
                      "text-color-grayPrimary font-normal border-2 rounded-xl focus:ring-2 p-6",
                      confirmPasswordError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-color-primaryDark"
                    )}
                    id="confirmPassword"
                    type="password"
                    placeholder="***********************"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-[10px] lg:text-[12px] xl:text-[14px] mt-1">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
                {isLoading && (
                  <div className="flex justify-center items-center space-x-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-color-primaryDark"></div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-[50px] xs:h-[54px] md:h-[48px] rounded-xl mt-3 text-[14px] xs:text-[15px] sm:text-[16px] md:text-[15px] lg:text-[17px] xl:text-[18px] bg-custom-gradient-tr hover:opacity-80"
                  disabled={isLoading}
                >
                  Ganti Password
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}