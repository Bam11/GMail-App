import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router";
import { MdRefresh } from "react-icons/md";
import { LuEllipsisVertical } from "react-icons/lu";

export default function MailNavTools() {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleMouseEnter = () => {
    setShowDropdown(true);
  }
  const handleMouseLeave = () => {
    setShowDropdown(false);
  }

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center justify-center gap-5 mt-2">
        <div
          className="inline-flex items-center justify-center gap-3 rounded-md focus:bg-white p-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-white outline-none">
          <input
            type="checkbox"
            className="appearance-none border-2 border-gray-500 size-3.5 outline-none
            checked:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22black%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22/%3E%3C/svg%3E')]
            checked:bg-no-repeat checked:bg-center checked:bg-contain
            cursor-pointer"
          />
          <Menu as="div" className="relative inline-block">
            <MenuButton className="flex items-center outline-none">
              <IoMdArrowDropdown aria-hidden="true" className="-mr-1 size-4 text-gray-600" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute left-3 top-9 z-10 w-40 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {["All", "None", "Read", "Unread", "Starred", "Unstarred"].map((option) => (
                  <MenuItem key={option}>
                    <Link
                      to=""
                      className="block px-13 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      {option}
                    </Link>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
        <MdRefresh size={20} className="text-gray-600" />
        <LuEllipsisVertical size={20} className="text-gray-600" />
      </div>
      <div className="flex items-center justify-center text-[#444] text-sm gap-5">
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          <p className="text-[12px] hover:bg-gray-400/30 p-2 rounded-sm hover:border transition-all duration-300 ease-in-out text-[#5e5e5e]">
            1 - 50 of 11,541
          </p>
          {showDropdown && (
            <div 
              className="absolute bg-white top-10 w-38 py-2 rounded-sm z-40 shadow-lg text-center flex flex-col justify-between gap-2 text-sm">
              <p
                className="hover:bg-gray-100 py-2"
              >
                Newest
              </p>
              <p className="hover:bg-gray-100 py-2">
                Oldest
              </p>
            </div>
          )}
        </div>
        <div>
          <IoIosArrowBack size={20} className="" />
        </div>
        <div>
          <IoIosArrowBack size={20} className="rotate-180" />
        </div>
      </div>
    </div>
  )
}
