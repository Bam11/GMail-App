import { useEffect, useState } from 'react'
import supabase from "~/lib/supabase"
import { useAuth } from '~/auth/authContext'
import { NavLink, Outlet, useNavigate } from 'react-router'
import ComposeMail from '~/components/compose-mail'
import { RxHamburgerMenu } from 'react-icons/rx'
import { RiDeleteBin6Line, RiInboxFill } from 'react-icons/ri'
import { FiArrowRight, FiInbox, FiPlus } from 'react-icons/fi'
import { IoIosArrowUp, IoMdStarOutline } from 'react-icons/io'
import { PiNumberCircleOneLight } from 'react-icons/pi'
import { GoClock } from 'react-icons/go'
import { BiSend } from 'react-icons/bi'
import { MdOutlineInsertDriveFile, MdOutlineShoppingBag } from 'react-icons/md'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

export default function Layout() {
  const [showMore, setShowMore] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      const { count: inbox } = await supabase
        .from("mail")
        .select("id", { count: "exact", head: true })
        .match({
          receiver_id: user.id,
          deleted: false,
        });

      const { count: draft } = await supabase
        .from("mail")
        .select("id", { count: "exact", head: true })
        .match({
          sender_id: user.id,
          is_draft: true,
        });

      setInboxCount(inbox ?? 0);
      setDraftCount(draft ?? 0);
    };

    fetchCounts();
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      setProgress(100);
      return;
    }

    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isAuthLoading]);


  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <img
          src="/images/gmail.PNG"
          alt="Gmail"
          className=""
        />

        <div className="w-48 h-1.5 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-[#ea4335] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">You are not logged in</p>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Proceed to Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden select-none">
      <div
        className="absolute inset-0 z-0 bg-[url('/images/mail-background.webp')] bg-cover bg-center bg-black/60 "
      />
      <div className="relative z-10 bg-white/10 backdrop-blur-xl flex w-screen">
        <aside className={`relative h-screen overflow-hidden flex flex-col space-y-4 transition-all duration-300 ${collapsed ? "min-w-2.5" : "min-w-[250px]"
          }`}>
          <div className="flex items-center gap-2.5 px-4 pt-2">
            <button
              type="button"
              onClick={() => setCollapsed(prev => !prev)}
              className="hover:bg-black/10 p-4 hover:rounded-full text-white cursor-pointer">
              <RxHamburgerMenu size={20} />
            </button>
            <img
              className="cursor-pointer"
              src="/images/gmail-logo.webp"
              alt="gmail-logo"
            />
          </div>

          <div className="flex flex-col">
            <div className="px-4">
              <ComposeMail collapsed={collapsed} />
            </div>

            <div className="flex flex-col gap-14">
              <div className="flex flex-col justify-center gap-5">
                <div className="flex flex-col mt-2 justify-center">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 ${isActive ? "bg-white/30" : "hover:bg-white/20"
                      } ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`}
                  >
                    <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                      <RiInboxFill size={20} className="text-white/70" />
                      {!collapsed && <p>Inbox</p>}
                    </div>
                    {!collapsed && <span>{inboxCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/sent"
                    className={({ isActive }) =>
                      `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 ${isActive ? "bg-white/30" : "hover:bg-white/20"
                      } ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`}
                  >
                    <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                      <BiSend size={20} className="text-white/70" />
                      {!collapsed && <p>Sent</p>}
                    </div>
                  </NavLink>
                  <NavLink
                    to="/draft"
                    className={({ isActive }) =>
                      `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 ${isActive ? "bg-white/30" : "hover:bg-white/20"
                      } ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`}
                  >
                    <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                      <MdOutlineInsertDriveFile size={20} className="text-white/70" />
                      {!collapsed && <p>Draft</p>}
                    </div>
                    {!collapsed && <span>{draftCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/trash"
                    className={({ isActive }) =>
                      `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 ${isActive ? "bg-white/30" : "hover:bg-white/20"
                      } ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`}
                  >
                    <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                      <RiDeleteBin6Line size={20} className="text-white/70" />
                      {!collapsed && <p>Trash</p>}
                    </div>
                  </NavLink>
                  <button
                    type="button"
                    className={
                      `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 hover:bg-white/20
                      } ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`}
                  >
                    {showMore === false ? (
                      <div className="flex items-center gap-6.5" onClick={() => setShowMore(true)}>
                        <IoIosArrowUp className="rotate-180" />
                        {!collapsed && <p>More</p>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-6.5" onClick={() => setShowMore(false)}>
                        <IoIosArrowUp className="" />
                        {!collapsed && <p>Less</p>}
                      </div>
                    )}
                  </button>
                  {showMore === true && (
                    <div className="flex flex-col justify-center">
                      <button
                        type="button"
                        className={
                          `text-white flex items-center  text-sm font-bold hover:cursor-pointer outline-none transition-all duration-300 hover:bg-white/20
                          ${collapsed ? "justify-center px-3 py-0.5 rounded-full w-10 ml-6" : "justify-between py-0.5 pl-8 pr-3 rounded-r-2xl w-full"}`
                        }
                      >
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <IoMdStarOutline size={20} className="text-white/70" />
                          {!collapsed && <p>Starred</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <GoClock size={20} className="text-white/70" />
                          {!collapsed && <p>Snooze</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <MdOutlineShoppingBag size={20} className="text-white/70" />
                          {!collapsed && <p>Purchases</p>}
                        </div>
                        {/* <span>12</span> */}
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>Important</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>Scheduled</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>All Mail</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <AiOutlineExclamationCircle size={20} className="rotate-180" />
                          {!collapsed && <p>Spam</p>}
                        </div>
                        {/* <span>4</span> */}
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>Manage Subscription</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>Manage labels</p>}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
                          <FiInbox size={20} />
                          {!collapsed && <p>Create new label</p>}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-white flex items-center justify-between pl-8 pr-3 outline-none">
                  {!collapsed && <p>Labels</p>}
                  <div className="hover:bg-white/10 p-2 rounded-full">
                    <FiPlus size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="absolute bottom-4 left-0 bg-white/20 text-white flex items-center justify-between gap-20 ml-6 py-2 px-3 text-sm font-bold rounded-2xl hover:cursor-pointer outline-none">
            <div className={`flex gap-5 ${collapsed ? "justify-center" : " "}`}>
              <PiNumberCircleOneLight size={20} className="text-black" />
              {!collapsed && <p>Upgrade</p>}
            </div>
            {!collapsed && <FiArrowRight size={20} />}
          </button>
        </aside>
        <Outlet />
      </div>
    </div>
  )
}
