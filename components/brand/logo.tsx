import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-[3.4rem] w-[3.4rem] shrink-0 overflow-hidden rounded-full border border-white/30 bg-white p-1 shadow-[0_18px_38px_-18px_rgba(2,6,23,0.9)] sm:h-[4.1rem] sm:w-[4.1rem]">
      <Image
        src="/brand/Lime-Modern-Padel-Club-Logo.jpg"
        alt="Elite Courts"
        fill
        sizes="(min-width: 640px) 66px, 54px"
        className="object-contain object-center"
        priority
        loading="eager"
        quality={100}
      />
    </div>
  );
}
