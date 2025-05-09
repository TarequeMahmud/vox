import Image from "next/image";
import React, { useState, useEffect } from "react";

const Logo = () => {
  const [logoSize, setLogoSize] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      setLogoSize(window.innerHeight > 768 ? 20 : 15);
    };

    handleResize();
  }, []);

  return (
    <div className="flex flex-row justify-center items-center md:h-7 h-6 md:w-20 w-13 bg-[#000000c8] rounded-3xl cursor-pointer">
      <Image
        src="/logo.png"
        alt="vox logo"
        height={logoSize}
        width={logoSize}
        className="mr-1"
        quality={100}
        unoptimized
      />
      <h1 className="md:text-lg text-sm text-[#ffffff] font-semibold">Vox</h1>
    </div>
  );
};

export default Logo;
