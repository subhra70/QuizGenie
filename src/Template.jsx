import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./component/navbar/Header";

function Template() {
  return (
    <div className="flex w-full min-h-screen absolute left-0 top-0 flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-20 px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Template;
