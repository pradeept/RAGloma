import { FileText, Link, MessageCircle } from "lucide-react";
import React from "react";

async function page() {
  return (
    <main className='flex flex-col justify-center gap-4 md:mt-40 mt-20'>
      <section className='text-center'>
        <h1 className='text-2xl'>Select a Mode</h1>
      </section>
      <section className='flex justify-center items-center gap-2 '>
        <a
          className='p-4 border m-3 cursor-pointer hover:dark:bg-black hover:bg-slate-100'
          href='/chat'
        >
          <MessageCircle />
        </a>
        <a
          className='p-4 border m-3 cursor-pointer hover:dark:bg-black hover:bg-slate-100'
          href='/doc-chat'
        >
          <FileText />
        </a>
        <a
          className='p-4 border m-3 cursor-pointer hover:dark:bg-black hover:bg-slate-100'
          href='/url-chat'
        >
          <Link />
        </a>
      </section>
    </main>
  );
}

export default page;
