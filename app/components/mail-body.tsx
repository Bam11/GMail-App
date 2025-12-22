import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { FiSmile } from 'react-icons/fi'
import { HiOutlineReply } from 'react-icons/hi'
import { IoIosArrowBack, IoMdArrowDropdown, IoMdStarOutline } from 'react-icons/io'
import { LuEllipsisVertical, LuForward } from 'react-icons/lu'
import { MdAttachFile, MdOutlineArchive, MdOutlineMarkEmailUnread } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { TiArrowLeft } from 'react-icons/ti'
import { type Mail } from "~/lib/types"
import moment from 'moment'
import { MailActions } from '~/lib/mailActions';
import { useEffect, useRef, useState } from 'react';
interface MailAttachment {
  name: string;
  url: string;
}



export default function MailBody({
  mail,
  onClose,
  context,
  start,
  end,
  total,
  onPrev,
  onNext,
  currentPage,
}: {
  mail: Mail;
  onClose: () => void,
  context: "inbox" | "trash" | "sent" | "draft";
  start: number;
  end: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  currentPage: number;
}) {
  const {
    reply,
    replyAll,
    forward,
    moveToTrash,
    markAsUnread,
    deletePermanently,
  } = MailActions();

  const mailActions1 = [
    { label: "Reply", icon: HiOutlineReply, action: () => reply(mail.id), },
    { label: "Forward", icon: LuForward, action: () => forward(mail.id), },
  ];

  const mailActions2 = [
    { label: "Delete", icon: RiDeleteBin6Line, action: () => moveToTrash(mail.id), },
    { label: "Mark as unread", icon: MdOutlineMarkEmailUnread, action: () => markAsUnread(mail.id), },
  ];

  const [openInfo, setOpenInfo] = useState(false);
  const isTrash = context === "trash";
  const softDelete = context === "inbox" || context === "sent" || context === "draft";
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function formatMailDate(date: string) {
    const now = moment();
    const created = moment(date);

    const diffInHours = now.diff(created, "hours");

    if (diffInHours < 24) {
      return `${created.format("h:mm A")} (${created.fromNow()})`;
    }

    return `${created.format("ddd, MMM D, h:mm A")} (${created.fromNow()})`;
  }

  async function handleMoveToTrash() {
    setIsDeleting(true);

    // allow animation to play
    setTimeout(async () => {
      await moveToTrash(mail.id);
      onClose(); // close mail view
    }, 300);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenInfo(false);
      }
    }

    if (openInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openInfo]);

  console.log("MAIL BODY CONTEXT", context);
  return (
    <div
      className={`transition-all duration-300 
        ${isDeleting ? "opacity-0 translate-x-10 scale-95" : "opacity-100"
        }`}
    >
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center justify-center gap-8 mt-2 text-gray-600">
          <button onClick={onClose}>
            <TiArrowLeft size={20} />
          </button>
          <MdOutlineArchive size={18} />
          <AiOutlineExclamationCircle size={18} />
          {isTrash && (
            <button
              type="button"
              className="cursor-pointer text-black text-sm"
              title="Delete forever"
              onClick={() => deletePermanently(mail.id)}
            >
              Delete Forever
            </button>
          )}
          {softDelete && (
            <button
              type="button"
              className="cursor-pointer "
              title="Delete"
              onClick={handleMoveToTrash}
            >
              <RiDeleteBin6Line size={18} />
            </button>
          )}
          <MdOutlineMarkEmailUnread size={18} />
          <LuEllipsisVertical size={18} />
        </div>
        <div className="flex items-center justify-center text-[#444] text-sm gap-5">
          <div>
            <p className="text-[12px] p-2 rounded-sm text-[#5e5e5e]">
              {start} - {end} of {total}
            </p>
          </div>
          <button
            type="button"
            className={`p-2 rounded-full cursor-pointer ${currentPage === 1 ? "opacity-40"
              : "hover:bg-gray-300"
              }`}
            disabled={currentPage === start}
            onClick={onPrev}
          >
            <IoIosArrowBack size={15} className="" />
          </button>
          <button
            type="button"
            className={`p-2 rounded-full cursor-pointer ${end === total ? "opacity-40"
              : "hover:bg-gray-300"
              }`}
            disabled={end === total}
            onClick={onNext}
          >
            <IoIosArrowBack size={15} className="rotate-180" />
          </button>
        </div>
      </div>
      <div className="bg-white h-full">
        <div className="pt-5 pl-[72px]">
          <h2 className="text-[#1f1f1f] text-[22px]">
            {mail.subject || "(no subject)"}
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
                      <span className="text-[#1f1f1f] text-sm font-bold">{mail.sender?.fullname}</span>{" "}
                      <span>&lt;{mail.sender?.email}&gt;</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-[#5e5e5e] text-[12px]">
                      {formatMailDate(mail.created_at)}
                    </p>
                    <div className="flex items-center gap-6 text-[#222]">
                      <IoMdStarOutline size={20} />
                      <FiSmile size={18} />
                      <div
                        className="cursor-pointer hover:bg-gray-50 p-2 rounded-full"
                        onClick={() => reply(mail.id)}
                      >
                        <HiOutlineReply size={18} />
                      </div>
                      <Menu as="div" className="relative inline-block">
                        <MenuButton className="cursor-pointer inline-flex w-full justify-center gap-x-1.5 bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-full outline-none">
                          <LuEllipsisVertical size={18} />
                        </MenuButton>
                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <div className="py-1">
                            {mailActions1.map(({ label, icon: Icon, action }) => (
                              <MenuItem key={label}>
                                {({ focus }) => (
                                  <button
                                    type="button"
                                    onClick={action}
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
                            {mailActions2.map(({ label, icon: Icon, action }) => (
                              <MenuItem key={label}>
                                {({ focus }) => (
                                  <button
                                    type="button"
                                    onClick={action}
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
                <div className="flex items-center gap-1.5 text-[#5e5e5e] text-[14px]">
                  to me
                  <div
                    className="relative inline-block"
                    ref={dropdownRef}
                  >
                    <button
                      type="button"
                      className="flex items-center font-semibold hover:bg-gray-50 outline-none"
                      onClick={() => setOpenInfo(v => !v)}
                    >
                      <IoMdArrowDropdown aria-hidden="true" className="size-4" />
                    </button>
                    {openInfo && (
                      <div className="absolute left-0 z-50  w-100 rounded-md shadow-lg border border-gray-200 bg-white p-3 mt-2">
                        <div className="grid grid-cols-[70px_1fr] gap-y-3 text-[13px] px-3">
                          <span className="text-gray-500">from:</span>
                          <p className="">
                            <span className="font-semibold text-black text-base">{mail.sender?.fullname}</span>{" "}
                            &lt;{mail.sender?.email}&gt;
                          </p>

                          <span className="text-gray-500">reply-to:</span>
                          <p className="text-black">
                            {mail.sender?.fullname} &lt;{mail.sender?.email}&gt;
                          </p>

                          <span className="text-gray-500">to:</span>
                          <p className="text-black">{mail.receiver?.email}</p>

                          <span className="text-gray-500">date:</span>
                          <p className="text-black">
                            {formatMailDate(mail.created_at)}
                          </p>

                          <span className="text-gray-500">subject:</span>
                          <p className="text-black">{mail.subject}</p>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="email-body" className="bg-[#f6f3f0] text-[#222] text-[13px]">
                <div className="w-[600px] mx-auto flex flex-col">
                  {/* <img
                    src="/images/test-image.jpg"
                    alt=""
                    className="cursor-pointer"
                  /> */}
                  <div
                    className="bg-white p-2.5 text-[13px]"
                    dangerouslySetInnerHTML={{ __html: mail.body }}
                  />
                </div>
              </div>
              {mail.attachments && mail.attachments.length > 0 && (
                <div className="mt-4 flex gap-3">
                  {mail.attachments.map((file: MailAttachment, index: number) => {
                    const isImage = file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    return isImage ? (
                      <img
                        key={index}
                        src={file.url}
                        alt={file.name}
                        className="max-w-[120px] rounded-sm cursor-pointer"
                      />
                    ) : (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border rounded-md px-3 py-2 h-10 hover:bg-gray-100"
                      >
                        <MdAttachFile size={16} />
                        <span className="text-sm">{file.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
          <div className="px-18 py-10">
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="border border-[#444746] text-[#444746] flex items-center gap-2 px-5 py-1 hover:bg-[#e3e3e3]  rounded-2xl cursor-pointer outline-none"
              >
                <HiOutlineReply size={15} />
                <p>Reply</p>
              </button>
              <button
                type="button"
                className="border border-[#444746] text-[#444746] flex items-center gap-2 px-5 py-1 hover:bg-[#e3e3e3]  rounded-2xl cursor-pointer outline-none"
              >
                <LuForward size={18} />
                <p>Forward</p>
              </button>
              <button
                type="button"
                className="border border-[#444746] text-[#444746] flex items-center gap-2 px-2.5 py-1.5 hover:bg-[#e3e3e3]  rounded-2xl cursor-pointer outline-none"
              >
                <FiSmile size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
