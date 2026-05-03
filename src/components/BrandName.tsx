import { type HTMLAttributes } from "react";

/** Full name with B and M visually emphasized (matches BtcnMiningBase spelling). */
export function BrandName({
  className = "",
  logo = false,
  ...rest
}: { logo?: boolean } & HTMLAttributes<HTMLSpanElement>) {
  if (logo) {
    return (
      <span className={`text-xl font-black tracking-tight ${className}`} {...rest}>
        <span className="text-white">
          <span className="font-black">B</span>tcn
        </span>
        <span className="text-gradient-teal">
          <span className="font-black">M</span>iningBase
        </span>
      </span>
    );
  }
  return (
    <span className={className} {...rest}>
      <span className="font-black">B</span>tcn
      <span className="font-black">M</span>iningBase
    </span>
  );
}
