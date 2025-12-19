import React, { useRef, type FC } from 'react'
import { HiOutlineReply } from 'react-icons/hi';
import { LuForward } from 'react-icons/lu';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { RiDeleteBin6Line, RiInboxFill } from 'react-icons/ri';
import { LuReplyAll } from "react-icons/lu";
import { useOnClickOutside } from '~/lib/useOnClickOutside';
import { MailActions } from '~/lib/mailActions';

interface contextMenuProps {
  x: number,
  y: number,
  mailId: string,
  closeContextMenu: () => void,
  context: "inbox" | "trash" | "sent" | "draft";
}

type MailActionName = 
  | "reply"
  | "replyAll"
  | "forward"
  | "moveToTrash"
  | "restoreMail"
  | "deletePermanently"
  | "markAsUnread"
  | "discardDraft";


function getActions(context: string) {
  switch (context) {
    case "trash":
      return {
        section1: [
          { label: "Reply", icon: HiOutlineReply, action: "reply" as MailActionName },
          { label: "Reply all", icon: LuReplyAll, action: "replyAll" as MailActionName},
          { label: "Forward", icon: LuForward, action: "forward" as MailActionName},
        ],
        section2: [
          { label: "Restore mail", icon: RiInboxFill, action: "restoreMail" as MailActionName},
          { label: "Delete forever", icon: RiDeleteBin6Line, action: "deletePermanently" as MailActionName},
          { label: "Mark as unread", icon: MdOutlineMarkEmailUnread, action: "markAsUnread" as MailActionName},
        ]
      };

    case "sent":
      return {
        section1: [
          { label: "Reply", icon: HiOutlineReply, action: "reply" as MailActionName},
          { label: "Reply all", icon: LuReplyAll, action: "replyAll" as MailActionName},
          { label: "Forward", icon: LuForward, action: "forward" as MailActionName},
        ],
        section2: [
          { label: "Delete", icon: RiDeleteBin6Line, action:"moveToTrash" as MailActionName},
          { label: "Mark as unread", icon: MdOutlineMarkEmailUnread, action: "markAsUnread" as MailActionName},
        ]
      };

    case "draft":
      return {
        section1: [
          { label: "Delete", icon: RiDeleteBin6Line, action:"moveToTrash" as MailActionName},
          { label: "Discard drafts", icon: RiDeleteBin6Line, action:"discardDraft" as MailActionName},
          { label: "Mark as unread", icon: MdOutlineMarkEmailUnread, action: "markAsUnread" as MailActionName},
        ]
      };

    default: //"inbox"
      return {
        section1: [
          { label: "Reply", icon: HiOutlineReply, action: "reply" as MailActionName},
          { label: "Reply all", icon: LuReplyAll, action: "replyAll" as MailActionName},
          { label: "Forward", icon: LuForward, action: "forward" as MailActionName},
        ],
        section2: [
          { label: "Delete", icon: RiDeleteBin6Line, action:"moveToTrash" as MailActionName},
          { label: "Mark as unread", icon: MdOutlineMarkEmailUnread, action: "markAsUnread" as MailActionName},
        ]
      };
  }
}

const ContextMenu: FC<contextMenuProps> = ({ x, y, mailId, closeContextMenu, context }) => {
  const contextMenuRef = useRef<HTMLDivElement>(null!);
  useOnClickOutside(contextMenuRef, closeContextMenu);  //the contextMenuRef is giving an error maybe you can help check if less busy

  const actions = getActions(context);
  const mail = MailActions();

  return (
    <div
      ref={contextMenuRef}
      // onClick={() => closeContextMenu()}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="absolute z-50 bg-white w-64 rounded-md shadow-lg border border-gray-200"
    >
      <div className="py-1">
        {actions.section1.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={async () => {
              console.log(label, "clicked");
              await mail[action](mailId);
              closeContextMenu();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
      <hr className="border-gray-200" />
      <div className="py-1">
        {actions.section2?.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={async () => {
              console.log(label, "clicked");
              await mail[action](mailId);
              closeContextMenu();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
    </div>


  )
}

export default ContextMenu;