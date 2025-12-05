import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router";
import { MdOutlineArchive, MdOutlineMarkEmailUnread, MdRefresh } from "react-icons/md";
import { LuEllipsisVertical } from "react-icons/lu";
import { TiArrowLeft } from 'react-icons/ti';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function MailNavBody() {

  return (
    <div className="flex items-center justify-between px-5 py-2">
      <div className="flex items-center justify-center gap-8 mt-2 text-gray-600">
        <button>
          <TiArrowLeft size={20} />
        </button>
        <MdOutlineArchive size={18} />
        <AiOutlineExclamationCircle size={18} />
        <RiDeleteBin6Line size={18} />
        <MdOutlineMarkEmailUnread size={18} />
        <LuEllipsisVertical size={18} />
      </div>
      <div className="flex items-center justify-center text-[#444] text-sm gap-5">
        <div>
          <p className="text-[12px] p-2 rounded-sm text-[#5e5e5e]">
            1 - 50 of 11,541
          </p>
        </div>
        <div>
          <IoIosArrowBack size={15} className="" />
        </div>
        <div>
          <IoIosArrowBack size={15} className="rotate-180" />
        </div>
      </div>
    </div>
  )
}
