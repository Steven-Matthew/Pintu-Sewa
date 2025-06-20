"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import PageImage from "../../../public/resetPassword.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useRef } from "react";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { useAuth } from "@/hooks/auth/useAuth";
import axios from "axios";
import { customerBaseUrl } from "@/types/globalVar";
import { AlertProps } from "@/types/alert";
import Alert from "../Alert";
import { useRouter } from "next/navigation";

interface ForgotPasswordFormProps {
  className?: string;
}

const ForgotPasswordForm = ({ className }: ForgotPasswordFormProps) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { validatePassword } = useAuthForm();
  const [alertState, setAlertState] = useState<
    AlertProps & { onCloseCallback?: () => void }
  >({
    isOpen: false,
    message: "",
    isWrong: true,
  });

  const { customerId, token } = useAuth();

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewPasswordError("");
    setConfirmPasswordError("");

    const newPasswordValidationError = validatePassword(newPassword);
    if (newPasswordValidationError) {
      setNewPasswordError(newPasswordValidationError);
      return;
    }

    // const confirmPasswordValidationError = validatePassword(confirmPassword);
    // if (confirmPasswordValidationError) {
    //   setConfirmPasswordError(confirmPasswordValidationError);
    //   return;
    // }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(
        !confirmPassword
          ? "Field ini tidak boleh kosong"
          : "Password tidak sama"
      );
      return;
    }

    const payload = {
      customer_id: customerId,
      password: newPassword,
    };

    try {
      setIsLoading(true);
      const res = await axios.put(
        `${customerBaseUrl}/forget-password`,
        payload
      );
      console.log("res change pass", res);
      if (res.data.error_schema.error_code == "PS-00-000") {
        setAlertState({
          isOpen: true,
          message: "Password Berhasil Diubah",
          isWrong: false,
          onCloseCallback: () => {
            if (token) {
              router.push("/profile");
            } else {
              localStorage.clear();
              router.push("/login");
            }
          },
        });
      }
    } catch (error) {
      setAlertState({ isOpen: true, message: "Gagal Mengubah Password" });
      console.error("Error during password reset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {alertState.isOpen && (
        <Alert
          message={alertState.message}
          isOpen={alertState.isOpen}
          isWrong={alertState.isWrong}
          onClose={() => {
            setAlertState((prev) => ({
              ...prev,
              isOpen: false,
              message: "",
              isWrong: true,
            }));
            alertState.onCloseCallback?.(); 
          }}
        />
      )}
      <div
        className={cn(
          "flex justify-center w-full h-full max-w-[1280px] max-h-[726px] mx-auto",
          className
        )}
      >
        <Card className="w-full h-[600px] flex justify-center items-center p-1 md:p-5 rounded-3xl">
          <div className="hidden lg:block lg:w-1/2 self-center">
            <Image
              src={PageImage}
              width={450}
              height={3500}
              alt="auth"
              className="justify-self-center object-contain"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <CardHeader className="flex-col">
              <CardTitle className="text-[22px] lg:text-[24px] xl:text-[28px] text-color-primaryDark font-semibold">
                Reset Password
              </CardTitle>
              <CardDescription className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[20px] text-color-primary font-normal font-sans">
                Yuk reset passwordmu biar bisa transaksi
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 mb-5">
                  <div className="grid gap-1 xs:gap-2">
                    <Label
                      htmlFor="newPassword"
                      className={`${
                        newPasswordError ? "text-red-500" : ""
                      } text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4`}
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
                      className={`${
                        confirmPasswordError ? "text-red-500" : ""
                      } text-[12px] lg:text-[14px] xl:text-[16px] mt-3 md:mt-4`}
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
    </>
  );
};

export default ForgotPasswordForm;
