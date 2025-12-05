import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { BiPurchaseTagAlt } from 'react-icons/bi'
import { LuUsers } from 'react-icons/lu'
import { RiInboxFill } from 'react-icons/ri'

const mailTitle = [
  { id: 1, icon: RiInboxFill, title: "Primary" },
  { id: 2, icon: BiPurchaseTagAlt, title: "Promotions" },
  { id: 3, icon: LuUsers, title: "Social" },
  { id: 4, icon: AiOutlineExclamationCircle, title: "Updates" }
]

export default function MailHeader() {
  return (
    <div className="flex items-center justify-between">
      {mailTitle.map((item, index) => {
        const Icon = item.icon;
        const outline = item.icon === AiOutlineExclamationCircle;
        return (
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center gap-5 p-4 pr-40 hover:bg-gray-400/20 text-[#444746] outline-0 focus:text-[#0b57d0] focus:border-b-2 focus:border-[#0b57d0]"
            key={index}
          >
            <div>
              <Icon size={20} className={outline ? "rotate-180" : ""}/>
            </div>
            <p className="text-sm font-semibold">
              {item.title}
            </p>
          </button>
        )
      })}
    </div>
  )
}
