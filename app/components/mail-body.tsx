import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { FiSmile } from 'react-icons/fi'
import { HiOutlineReply } from 'react-icons/hi'
import { IoIosArrowBack, IoMdArrowDropdown, IoMdStarOutline } from 'react-icons/io'
import { LuEllipsisVertical, LuForward } from 'react-icons/lu'
import { MdOutlineArchive, MdOutlineMarkEmailUnread } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { TiArrowLeft } from 'react-icons/ti'

const mailActions1 = [
  { label: "Reply", icon: HiOutlineReply },
  { label: "Forward", icon: LuForward },
];

const mailActions2 = [
  { label: "Delete", icon: RiDeleteBin6Line },
  { label: "Mark as unread", icon: MdOutlineMarkEmailUnread },
];



export default function MailBody({ onClose }: { onClose: () => void }) {
  return (
    <div className="">
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center justify-center gap-8 mt-2 text-gray-600">
          <button onClick={onClose}>
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
      <div className="bg-white h-full">
        <div className="pt-5 pl-[72px]">
          <h2 className="text-[#1f1f1f] text-[22px]">
            Your Week 4 Replay Is Ready - Don't Fall Behind!
          </h2>
        </div>
        <div className="flex flex-col pt-5 ">
          <div className="flex">
            <div className="px-4">
              <img
                src="/images/default-avatar.webp"
                alt="sender image"
                className="size-10 rounded-full bg-[#ccc] text-blue-600"
              />
            </div>
            <div className="flex flex-col w-full pr-4">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-[#5f6368] text-[12px]">
                      <span className="text-[#1f1f1f] text-sm font-bold">The Incubator Hub</span>{" "}
                      <span>&lt;info@ncubatorng.org&gt;</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-[#5e5e5e] text-[12px]">
                      Nov 21, 2025, 10:46 AM (1 day ago)
                    </p>
                    <div className="flex items-center gap-6 text-[#222]">
                      <IoMdStarOutline size={20} />
                      <FiSmile size={18} />
                      <HiOutlineReply size={18} />
                      <Menu as="div" className="relative inline-block">
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-full outline-none">
                          <LuEllipsisVertical size={18} />
                        </MenuButton>
                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <div className="py-1">
                            {mailActions1.map(({ label, icon: Icon }) => (
                              <MenuItem key={label}>
                                {({ focus }) => (
                                  <button
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm
                                      ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                                  >
                                    <Icon className="size-4" />
                                    {label}
                                  </button>
                                )}
                              </MenuItem>
                            ))}
                          </div>
                          <div className="py-1">
                            {mailActions2.map(({ label, icon: Icon }) => (
                              <MenuItem key={label}>
                                {({ focus }) => (
                                  <button
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm
                                      ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                                  >
                                    <Icon className="size-4" />
                                    {label}
                                  </button>
                                )}
                              </MenuItem>
                            ))}
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#5e5e5e] text-[12px]">
                  to me
                  <Menu as="div" className="relative inline-block">
                    <MenuButton className="flex items-center outline-none font-semibold hover:bg-gray-50">
                      <IoMdArrowDropdown aria-hidden="true" className="size-4" />
                    </MenuButton>
                  </Menu>
                </div>
              </div>
              <div id="email-body" className="bg-[#f6f3f0] text-[#222] text-[13px]">
                <div className="w-[600px] mx-auto flex flex-col">
                  <img 
                    src="/images/test-image.jpg" 
                    alt="" 
                    className="cursor-pointer"
                  />
                  <div className="bg-white p-2.5 text-[13px]">
                    <p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            Bottom
          </div>
        </div>
      </div>
    </div>
  )
}
