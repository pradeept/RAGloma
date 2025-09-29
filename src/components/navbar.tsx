import React from "react";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { Github } from "lucide-react";

function Navbar() {
  return (
    <nav className='flex justify-evenly items-center  h-20 sticky top-0 backdrop-blur-xl'>
      <div>
        <Link className='text-3xl ' href='/'>
          RAGloma
        </Link>
      </div>
      <div className="flex gap-2 md:gap-5 items-center">
        <ModeToggle />
        <a
          href='https://github.com/pradeept/RAGloma'
          target='_blank'
          rel='noreferrer'
          className="border p-[4px] dark:bg-slate-900 rounded"
        >
          <Github />
        </a>
      </div>{" "}
    </nav>
  );
}

export default Navbar;
