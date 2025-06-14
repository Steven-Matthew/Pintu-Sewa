"use client"

import Whatsapp from "@/public/whatsapp.svg";
import Instagram from "@/public/instagram.svg";
import Email from "@/public/email.svg";
import Image from "next/image";
import WebLogo from "@/public/pintuSewaWhite.svg";
import {useRouter} from "next/navigation"

const Footer = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-[400px] flex flex-col justify-center bg-gradient-to-r from-[#052659] to-[#0B52BF]">
      <div className="flex h-4/5 justify-around">
        <div className="flex flex-col h-full w-full px-10 md:px-32 xl:px-80 ">
          <div className="h-2/5">
            {/* <h2 className="font-jakartaSans font-semibold text-[40px] text-white my-5">
              siap-sewa.
            </h2> */}
            <Image src={WebLogo} alt="logo" className="w-[200px] h-[150px] md:w-[250px] md:h-[150px]" />
          </div>
          <div className="h-3/5 flex flex-wrap justify-between">
            <div className="flex flex-col justify-between space-y-7 md:space-y-0 mb-10">
              <h4 onClick={() => router.push("/about")} className="text-[14px] lg:text-[18px] text-white font-light hover:underline hover:cursor-pointer">
                Tentang Pintu Sewa
              </h4>
              <h4 onClick={() => router.push("/terms-and-conditions")} className="text-[14px] lg:text-[18px] text-white font-light hover:underline hover:cursor-pointer">
                Syarat dan Ketentuan Pengguna
              </h4>
              <h4 onClick={() => router.push("/privacy-policy")} className="text-[14px] lg:text-[18px] text-white font-light hover:underline hover:cursor-pointer">
                Kebijakan Pengguna
              </h4>
              <h4 onClick={() => router.push("/frequently-asked-questions")} className="text-[14px] lg:text-[18px] text-white font-light hover:underline hover:cursor-pointer">FAQ</h4>
            </div>
            <div className="flex flex-col justify-between pb-16 gap-y-4">
              <h4 className="text-[18px] text-white font-medium ">
                Media Sosial
              </h4>
              <div className="flex items-center">
                <Image
                  src={Whatsapp}
                  alt="whatsapp"
                  className="mr-2 w-[28px] h-[28px]"
                />
                <h4 className="text-[14px]  text-white font-light ml-2">
                  08x-xxx-xxx-xxx
                </h4>
              </div>
              <div className="flex items-center">
                <Image
                  src={Instagram}
                  alt="instagram"
                  className="mr-2 w-[28px] h-[28px]"
                />
                <h4 className="text-[14px] text-white font-light ml-2">
                  @pintu-sewa
                </h4>
              </div>
              <div className="flex items-center">
                <Image
                  src={Email}
                  alt="whatsapp"
                  className="mr-2 w-[28px] h-[28px]"
                />
                <h4 className="text-[14px] text-white font-light ml-2">
                  admin@pintusewa.co.id
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-orange-50"></div>
      </div>
      <div className="mx-auto text-[10px] lg:text-[14px] w-full text-center h-1/5 border-t-2 border-t-white pt-6 font-light text-white mb-6">
        @2025 Pintu Sewa - Developed by Ahay-Ahay Lulus Duluan
      </div>
    </div>
  );
};

export default Footer;
