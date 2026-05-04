import Image from "next/image";

export default function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/Ovation%20Workplace%20Services.png"
        alt="Ovation Workplace Services"
        width={168}
        height={34}
        priority
        style={{ height: "34px", width: "auto" }}
        className="select-none"
      />
    </span>
  );
}
