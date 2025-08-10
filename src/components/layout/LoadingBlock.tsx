import React from "react";

export default function LoadingBlock() {
  return (
    <div className="flex items-center justify-center p-20">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-4 border-blue-500 rounded-full animate-spin-slow"></div>
      </div>
      <div className="ml-4 text-neutral-500">Loading...</div>
    </div>
  );
}