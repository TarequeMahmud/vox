import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex flex-row justify-center items-center h-7 w-20 bg-[#000000c8] rounded-3xl cursor-pointer">
      <Image
        src="/logo.png"
        alt="vox logo"
        height={20}
        width={20}
        className="mr-1"
        quality={100}
        unoptimized
      />
      <h1 className="text-lg text-[#ffffff] font-semibold">Vox</h1>
    </div>
  );
};

export default Logo;
