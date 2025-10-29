import Image from "next/image";
import React from "react";
import logo from "@/../public/logo.png";
function Logo() {
  return (
    <div>
      <Image src={logo} alt='logo-icon' width={60} height={60} className="dark:invert" />
    </div>
  );
}

export default Logo;
