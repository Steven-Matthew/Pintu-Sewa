"use client";

import Image from "next/image";
import OpenShop from "@/public/openShop.svg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import LabelledInput from "@/components/fragments/editProfile/LabelledInput";
import Section from "@/components/fragments/filter/Section";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TextedCheckbox from "@/components/fragments/TextedCheckbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LabelledDropdown from "@/components/fragments/editProfile/LabelledDropdown";

interface dataAlamatProps {
  id: string;
  text: string;
}

const CreateShopBody = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [addressType, setAddressType] = useState("Alamat Saat Ini");
  const [provinsi, setProvinsi] = useState<dataAlamatProps[]>([]);
  const [kabupaten, setKabupaten] = useState<dataAlamatProps[]>([]);
  const [kecamatan, setKecamatan] = useState<dataAlamatProps[]>([]);
  const [kodePos, setKodePos] = useState<dataAlamatProps[]>([]);
  const [jalan, setJalan] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string | number>("");
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | number>(
    ""
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | number>(
    ""
  );
  const [selectedKodePos, setSelectedKodePos] = useState<string | number>("");

  const [errors, setErrors] = useState({
    shopName: "",
    email: "",
    jalan: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
  });

  const getTextById = (id: string | number, data: dataAlamatProps[]) => {
    const item = data.find((item) => item.id === id.toString());
    return item ? item.text : "";
  };

  const getIdByText = (
    text: string,
    data: dataAlamatProps[]
  ): string | number => {
    const item = data.find((item) => item.text === text);
    return item ? item.id : "";
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      shopName: shopName.trim()
        ? shopName.length <= 20
          ? ""
          : "Nama toko maksimal 20 karakter"
        : "Nama toko tidak boleh kosong",
      email: email.trim()
        ? emailRegex.test(email)
          ? ""
          : "Format email tidak valid"
        : "Email tidak boleh kosong",
      jalan: jalan.trim() ? "" : "Jalan tidak boleh kosong",
      provinsi: selectedProvinsi ? "" : "Provinsi harus dipilih",
      kabupaten: selectedKabupaten ? "" : "Kabupaten harus dipilih",
      kecamatan: selectedKecamatan ? "" : "Kecamatan harus dipilih",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    router.push("/input-confirmation");
  };

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await fetch(
          "https://alamat.thecloudalert.com/api/provinsi/get/"
        );
        const data = await response.json();
        if (data.status === 200) {
          setProvinsi(data.result);
          setSelectedProvinsi(
            getIdByText(localStorage.getItem("provinsi") || "1", data.result) ||
              data.result[0].id
          );
        }
      } catch (error) {
        console.error("Gagal mengambil data provinsi:", error);
      }
    };
    fetchProvinsi();
  }, []);

  useEffect(() => {
    const fetchKabupaten = async () => {
      if (selectedProvinsi) {
        try {
          const response = await fetch(
            `https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${selectedProvinsi}`
          );
          const data = await response.json();
          if (data.status === 200) {
            setKabupaten(data.result);
            setSelectedKabupaten(
              getIdByText(
                localStorage.getItem("kabupaten") || "1",
                data.result
              ) || data.result[0].id
            );
          }
        } catch (error) {
          console.error("Gagal mengambil data kabupaten:", error);
        }
      }
    };
    fetchKabupaten();
  }, [selectedProvinsi]);

  useEffect(() => {
    const fetchKecamatan = async () => {
      if (selectedKabupaten) {
        try {
          const response = await fetch(
            `https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=${selectedKabupaten}`
          );
          const data = await response.json();
          if (data.status === 200) {
            setKecamatan(data.result);
            setSelectedKecamatan(
              getIdByText(
                localStorage.getItem("kecamatan") || "1",
                data.result
              ) || data.result[0].id
            );
          }
        } catch (error) {
          console.error("Gagal mengambil data kecamatan:", error);
        }
      }
    };
    fetchKecamatan();
  }, [selectedKabupaten]);

  useEffect(() => {
    const fetchKodePos = async () => {
      if (selectedKabupaten && selectedKecamatan) {
        try {
          // console.log("selected kabupaten:" + selectedKabupaten, "selectedKecamatan :" + selectedKecamatan);
          const response = await fetch(
            `https://alamat.thecloudalert.com/api/kodepos/get/?d_kabkota_id=${selectedKabupaten}&d_kecamatan_id=${selectedKecamatan}`
          );
          const data = await response.json();
          if (data.status === 200) {
            setKodePos(data.result);
            setSelectedKodePos(
              getIdByText(
                localStorage.getItem("kodepos") || "1",
                data.result
              ) || data.result[0].id
            );
          } else {
            setKodePos([]);
            setSelectedKodePos("");
          }
        } catch (error) {
          console.log("Gagal mengambil data kode pos:", error);
        }
      }
    };
    fetchKodePos();
  }, [selectedKabupaten, selectedKecamatan]);

  return (
    <div className="flex justify-center pb-16 px-2 lg:px-6 mx-auto w-full max-w-[1280px] min-h-screen h-auto bg-color-layout pt-12">
      <div className="hidden lg:flex flex-col w-1/2 items-center">
        <h2 className="text-[24px] xl:text-[32px] font-semibold text-color-primary">
        Mulai Sewain Barang Di Pintu Sewa
        </h2>
        <Image
          src={OpenShop}
          alt="openShop"
          className="w-[300px] h-[300px] xl:w-[400px] xl:h-[400px] mt-4"
          width={500}
          height={372}
        />
      </div>

      <div className="flex flex-col w-full lg:w-1/2 md:max-h-[815px]">
        <h2 className="text-[18px] sm:text-[20px] md:text-2xl font-semibold text-color-primary text-center lg:hidden">
          Mulai Sewain Barang Di Pintu Sewa
        </h2>
        <Card className="mt-6 px-6 border-none shadow-lg">
          <CardHeader className="border-b-[1px] border-b-[#D9D9D9] border-opacity-70 px-0 pb-3">
            <h2 className="w-full text-sm md:text-base lg:text-xl font-semibold text-color-primary">
              Formulir Detail Toko
            </h2>
          </CardHeader>
          <form action="submit" onSubmit={() => alert("submit")}>
            <CardContent className="px-0 pt-3 space-y-5">
              <LabelledInput
                label="Nama Toko"
                htmlFor="nama toko"
                id="nama toko"
                type="text"
                placeholder=""
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
              <LabelledInput
                label="Email"
                htmlFor="email"
                id="email"
                type="email"
                placeholder="toko@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Section Header="Alamat Toko">
                <RadioGroup
                  defaultValue="Alamat Baru"
                  className="flex flex-row space-x-6 mt-1"
                  value={addressType}
                  onValueChange={(value) => setAddressType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Alamat Saat Ini"
                      id="Alamat Saat Ini"
                    />
                    <Label
                      htmlFor="option-one"
                      className="text-[12px] text-color-primary font-medium"
                    >
                      Alamat Saat Ini
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Alamat Baru" id="Alamat Baru" />
                    <Label
                      htmlFor="option-two"
                      className="text-[12px] text-color-primary font-medium"
                    >
                      Alamat Baru
                    </Label>
                  </div>
                </RadioGroup>
              </Section>

              {addressType === "Alamat Baru" && (
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col">
                    {errors.jalan && (
                      <p className="text-red-500 text-xs md:text-md">
                        {errors.jalan}
                      </p>
                    )}
                    <LabelledInput
                      label="Jalan"
                      htmlFor="jalan"
                      id="jalan"
                      type="text"
                      value={jalan}
                      onChange={(e) => setJalan(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-4">
                    <div className="flex flex-col w-full md:w-1/2">
                      {errors.kecamatan && (
                        <p className="text-red-500 text-xs md:text-md">
                          {errors.kecamatan}
                        </p>
                      )}
                      <LabelledDropdown
                        label="Kecamatan"
                        htmlFor="kecamatan"
                        id="kecamatan"
                        options={kecamatan.map((k) => ({
                          value: k.id,
                          label: k.text,
                        }))}
                        value={selectedKecamatan}
                        onValueChange={setSelectedKecamatan}
                        disabled={!selectedKabupaten}
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/2">
                      {errors.kabupaten && (
                        <p className="text-red-500 text-xs md:text-md">
                          {errors.kabupaten}
                        </p>
                      )}
                      <LabelledDropdown
                        label="Kabupaten"
                        htmlFor="kabupaten"
                        id="kabupaten"
                        options={kabupaten.map((k) => ({
                          value: k.id,
                          label: k.text,
                        }))}
                        value={selectedKabupaten}
                        onValueChange={setSelectedKabupaten}
                        disabled={!selectedProvinsi}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-4">
                    <div className="flex flex-col w-full md:w-1/2">
                      {errors.provinsi && (
                        <p className="text-red-500 text-xs md:text-md">
                          {errors.provinsi}
                        </p>
                      )}
                      <LabelledDropdown
                        label="Provinsi"
                        htmlFor="provinsi"
                        id="provinsi"
                        options={provinsi.map((k) => ({
                          value: k.id,
                          label: k.text,
                        }))}
                        value={selectedProvinsi}
                        onValueChange={setSelectedProvinsi}
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/2">
                      {/* {errors.kodepos && (
            <p className="text-red-500 text-xs md:text-md">{errors.kodepos}</p>
          )} */}
                      <LabelledDropdown
                        label="Kode Pos"
                        htmlFor="kodepos"
                        id="kodepos"
                        options={kodePos.map((k) => ({
                          value: k.id,
                          label: k.text,
                        }))}
                        value={selectedKodePos}
                        onValueChange={setSelectedKodePos}
                        disabled={!selectedKecamatan}
                      />
                    </div>
                  </div>
                </div>
              )}

              <TextedCheckbox
                className="text-sm text-color-primary"
                checked={agreedToTerms}
                onCheckedChange={() => setAgreedToTerms(!agreedToTerms)}
              >
                Saya menyetujui <span className="font-semibold">syarat</span>{" "}
                dan <span className="font-semibold">ketentuan</span> Pembuatan
                Toko
              </TextedCheckbox>
            </CardContent>
            <CardFooter className="flex justify-center lg:justify-start px-0">
              <Button
                className="w-[200px] h-[48px] rounded-xl text-white text-base md:text-sm font-medium py-3 px-6 bg-custom-gradient-tr disabled:opacity-50 hover:opacity-70"
                type="submit"
                disabled={!agreedToTerms}
              >
                Daftar Toko Sekarang
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateShopBody;
