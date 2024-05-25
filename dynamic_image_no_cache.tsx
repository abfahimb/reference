
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import product from "@/public/sample-product.png";
import { storeOrder } from "@/src/config/store/state";

const GetImage: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pngFound, setPngFound] = useState(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [renderCount, setRenderCount] = useState(0);
  const [urlImage, setUrlImage] = useState<string>("");

  useEffect(() => {
    const version = new Date().getTime();
    setPngFound(false);
    if (orderId && version) {
      const urlImage = `https://${process.env.NEXT_PUBLIC_URL_APP}/app/assets/img/cigar-designer/${orderId}.png?v=${version}`;
      setUrlImage(urlImage);
    }
  }, [setUrlImage, setPngFound, orderId]);

  useEffect(() => {
    if (urlImage !== "" && renderCount > 1)
      storeOrder.setState((state) => {
        return {
          ...state,
          urlImage: urlImage,
        };
      });
  }, [urlImage, renderCount]);

  return (
    <div className="relative max-[900px]:max-h-0">
      <Image
        src={pngFound ? urlImage : product}
        className={`animate-delay-400 m-auto h-auto w-auto min-w-full animate-jump-in animate-duration-1000 ${isLoading ? "opacity-0" : ""}`}
        width={500}
        height={500}
        alt=""
        priority
        onLoad={() => {
          setTimeout(() => {
            setPngFound(true);
            setIsLoading(false);
          }, 1500);
          setRenderCount((prevCount) => prevCount + 1);
        }}
        onError={() => {
          setTimeout(() => {
            if (retryCount < 4) {
              setPngFound(true);
              setIsLoading(true);
              setRetryCount((prev) => prev + 1);
            } else {
              setPngFound(false);
              setIsLoading(false);
            }
          }, 2000);
        }}
      />

      {renderCount !== 2 && (
        <Image
          src={product}
          className={`animate-delay-400 absolute top-0 m-auto h-auto w-auto min-w-full animate-jump-in animate-duration-1000`}
          width={500}
          height={500}
          alt="Loading..."
          priority
        />
      )}
    </div>
  );
};

export default GetImage;

---------------------------------------
---------------------------------------
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import product from "@/public/sample-product.png";

const GetImage: React.FC<{ orderId: string; countApiCall: number }> = ({
  orderId,
  countApiCall,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pngFound, setPngFound] = useState(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [version, setVersion] = useState<number>(0);

  useEffect(() => {
    setVersion(new Date().getTime());
    setPngFound(false);
  }, [setVersion, setPngFound]);

  return (
    <div>
      <Image
        src={
          pngFound && !isLoading
            ? `https://${process.env.NEXT_PUBLIC_URL_APP}/assets/cigar-designer/${orderId}.png?v=${version}`
            : product
        }
        className={`m-auto h-auto w-auto min-w-full`}
        width={500}
        height={500}
        alt="Loading..."
        priority
        onLoad={() => {
          setTimeout(() => {
            setPngFound(true);
            setIsLoading(false);
          }, 2000);
        }}
        onError={() => {
          setPngFound(true);
          setIsLoading(false);
          if (retryCount < countApiCall) {
            setRetryCount((prev) => prev + 1);
            setTimeout(() => {
              setPngFound(false);
            }, 2000);
          }
        }}
      />
    </div>
  );
};

export default GetImage;
