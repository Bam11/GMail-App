import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import ComposeMail from '~/components/compose-mail'
import { RxHamburgerMenu } from 'react-icons/rx'
import { RiInboxFill } from 'react-icons/ri'
import { FiArrowRight, FiInbox, FiPlus } from 'react-icons/fi'
import { IoIosArrowUp, IoMdStarOutline } from 'react-icons/io'
import { PiNumberCircleOneLight } from 'react-icons/pi'
import { GoClock } from 'react-icons/go'
import { BiSend } from 'react-icons/bi'
import { MdOutlineInsertDriveFile, MdOutlineShoppingBag } from 'react-icons/md'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

export default function Layout() {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden select-none">
      <div
        className="absolute inset-0 z-0 bg-[url('/images/mail-background.webp')] bg-cover bg-center bg-black/60 "
      />
      <div className="relative z-10 bg-white/10 backdrop-blur-xl flex w-screen">
        <aside className="relative h-screen overflow-hidden flex flex-col min-w-[250px] space-y-4">
          <div className="flex items-center gap-2.5 px-4 pt-2">
            <div className="hover:bg-black/10 p-4 hover:rounded-full text-white cursor-pointer">
              <RxHamburgerMenu size={20} />
            </div>
            <img
              className="cursor-pointer"
              src="/images/gmail-logo.webp"
              alt="gmail-logo"
            />
          </div>

          <div className="flex flex-col">
            <div className="px-4">
              <ComposeMail />
            </div>

            <div className="flex flex-col gap-14">
              <div className="flex flex-col justify-center gap-5">
                <div className="flex flex-col mt-2 justify-center">
                  <Link
                    to="/"
                    className="bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <RiInboxFill size={20} className="text-white/70"/>
                      <p>Inbox</p>
                    </div>
                    <span>9,802</span>
                  </Link>
                  <button
                    type="button"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <IoMdStarOutline size={20} className="text-white/70"/>
                      <p>Starred</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <GoClock  size={20} className="text-white/70"/>
                      <p>Snooze</p>
                    </div>
                  </button>
                  <Link
                    to="/sent"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <BiSend size={20} className="text-white/70"/>
                      <p>Sent</p>
                    </div>
                  </Link>
                  <Link
                    to="/draft"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <MdOutlineInsertDriveFile size={20} className="text-white/70"/>
                      <p>Draft</p>
                    </div>
                    <span>4</span>
                  </Link>
                  <button
                    type="button"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    <div className="flex gap-5">
                      <MdOutlineShoppingBag  size={20} className="text-white/70"/>
                      <p>Purchases</p>
                    </div>
                    <span>12</span>
                  </button>
                  <button
                    type="button"
                    className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                    {showMore === false ? (
                      <div className="flex items-center gap-6.5" onClick={() => setShowMore(true)}>
                        <IoIosArrowUp className="rotate-180" />
                        <p>More</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6.5" onClick={() => setShowMore(false)}>
                        <IoIosArrowUp className="" />
                        <p>Less</p>
                      </div>
                    )}
                  </button>
                  {showMore === true && (
                    <div className="flex flex-col justify-center">
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Important</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Scheduled</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>All Mail</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <AiOutlineExclamationCircle size={20} className="rotate-180"/>
                          <p>Spam</p>
                        </div>
                        <span>4</span>
                      </button>
                      <Link
                        to="/trash"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Trash</p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Manage Subscription</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Manage labels</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-white/30 text-white flex items-center justify-between py-0.5 pl-8 pr-3 text-sm font-bold rounded-r-2xl hover:cursor-pointer outline-none">
                        <div className="flex gap-5">
                          <FiInbox size={20} />
                          <p>Create new label</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-white flex items-center justify-between pl-8 pr-3 outline-none">
                  Labels
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
            <div className="flex gap-3">
              <PiNumberCircleOneLight size={20} className="text-black" />
              <p>Upgrade</p>
            </div>
            <FiArrowRight size={20} />
          </button>
        </aside>
        <Outlet />
      </div>
    </div>
  )
}
