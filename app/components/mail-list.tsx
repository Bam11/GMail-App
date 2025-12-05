import moment from "moment";
import { useState, type MouseEvent } from "react";
import { IoMdStarOutline } from "react-icons/io";
import { LuClock4 } from "react-icons/lu";
import {
  MdDragIndicator,
  MdOutlineArchive,
  MdOutlineMarkEmailUnread
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MailActions } from "~/lib/mailActions";
import ContextMenu from "./context-menu";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
}

export default function MailList({ mail, onOpenMail, context}:
  {
    mail: any;
    onOpenMail: (mail: any) => void;
    context: "inbox" | "trash" | "sent" | "draft";
  }) {

  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const { moveToTrash } = MailActions();

  const handleContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    const { pageX, pageY } = e;
    setContextMenu({show:true, x:pageX, y:pageY});
  }

  const contextMenuClose = () => setContextMenu(initialContextMenu);

  return (
    <>
      {contextMenu.show && 
        <ContextMenu x ={contextMenu.x} y={contextMenu.y} closeContextMenu={contextMenuClose} context={context}/>
      }
      <div
        className="group bg-white/5 flex items-center justify-between gap-9 text-[#444746] text-sm py-1 px-4.5 border-y border-[#8080805d] cursor-pointer transition"
        onClick={() => onOpenMail(mail)}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-center group-hover:-ml-4.5">
          <MdDragIndicator size={18} className="text-[#444746]/60 hidden group-hover:block" />
          <div className="flex items-center justify-center gap-3">
            <input
              type="checkbox"
              className="appearance-none border-2 border-gray-500 size-3.5 outline-none group-hover:border-black/70
              checked:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22black%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22/%3E%3C/svg%3E')]
              checked:bg-no-repeat checked:bg-center checked:bg-contain
              cursor-pointer"
            />
            <IoMdStarOutline size={20} className="group-hover:text-black" />
            <p className="">
              {mail.sender?.fullname}
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="mail-title truncate whitespace-nowrap">
            {mail.subject} &ndash; {" "}
            <span>{mail.body.substring(0, 150)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[12px] group-hover:hidden">{moment(mail.created_at).fromNow()}</p>
          <div className="hidden group-hover:flex items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {context === "inbox" && (
              <>
                <MdOutlineArchive size={20} />
                <button
                  type="button"
                  onClick={() => moveToTrash(mail.id)}
                  className="cursor-pointer"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
                <MdOutlineMarkEmailUnread size={20} />
                <LuClock4 size={20} />
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}