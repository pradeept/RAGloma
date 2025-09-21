"use client";
import React from "react";
import { motion } from "motion/react";

function DisplayResponse({
  responseText,
  loading,
}: {
  responseText: string;
  loading: boolean;
}) {
  return (
    <div className='w-full max-w-2xl mx-auto mt-6 flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <span className='inline-block bg-blue-800 text-white rounded-lg px-3 py-1 text-lg font-bold shadow'>
          Response
        </span>
        {loading && (
          <span className='text-blue-500 animate-pulse text-base font-semibold'>
            (Translating...)
          </span>
        )}
      </div>
      <div className='bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border border-gray-300 text-gray-900 min-h-16 p-6 rounded-2xl shadow-inner w-full'>
        {responseText !== "" ? (
          <div className='flex items-center'>
            <span className='font-semibold text-xl whitespace-pre-wrap break-words'>
              {responseText}
            </span>
            {loading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className='ml-1 font-semibold text-xl text-blue-500'
              >
                |
              </motion.span>
            )}
          </div>
        ) : (
          <span className='text-gray-400 text-base'>
            Your translation will appear here.
          </span>
        )}
      </div>
    </div>
  );
}

export default DisplayResponse;
