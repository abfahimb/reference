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
