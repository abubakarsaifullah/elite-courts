import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-11 w-[178px] shrink-0 sm:h-12 sm:w-[196px]">
      <Image
        src="/brand/original-logo.svg"
        alt="Elite Courts"
        fill
        sizes="(min-width: 640px) 196px, 178px"
        className="object-contain object-left"
      />
    </div>
  );
}
