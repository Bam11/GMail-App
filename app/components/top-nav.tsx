import React, { useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import { FaRegQuestionCircle, FaTimes } from 'react-icons/fa';
import { IoCloseSharp, IoSettingsOutline } from 'react-icons/io5';
import { CgMenuGridO } from 'react-icons/cg';
import { GoSignOut } from 'react-icons/go';
import { useAuth } from "../auth/authContext";

export default function TopNav() {
  const { user, handleLogout } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [miniProfile, setMiniProfile] =  useState(false);

  const handleClear = () => {
    setSearchText("")
  }

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="bg-white/10 py-1 px-4 flex items-center justify-between gap-5 rounded-sm min-w-[720px] backdrop-blur-sm">
        <div className="flex gap-3 items-center w-full" >
          <IoMdSearch size={24} className="text-white cursor-pointer" />
          <input
            type="text"
            value={searchText}
            placeholder="Search mail"
            className="outline-none bg-transparent text-white placeholder-white/70 w-full py-3 px-2 rounded-sm "
            onChange={(e) => {
              setSearchText(e.target.value)
            }}
          />
          {searchText.length > 0 ? (
            <div className="text-black/20 flex items-center gap-3 cursor-pointer">
            <FaTimes size={20} 
              className="font-normal cursor-pointer" 
              onClick={handleClear}
            />
              <svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path>
              </svg>
            </div>
          ) : (
            <button className="">
              <svg
                xmlns="http://www.w3.org/2000/svg" className="fill-white" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className='flex items-center justify-center gap-2.5 text-white'>
        <div className='cursor-pointer hover:bg-white/10 p-2 rounded-full font-normal'>
          <FaRegQuestionCircle size={22} />
        </div>
        <div className='cursor-pointer hover:bg-white/10 p-2 rounded-full'>
          <IoSettingsOutline size={24} />
        </div>
        <span className='hover:animate-[spin_2s_linear]'>
          <svg
            focusable="false" viewBox="0 -960 960 960" fill='white' height={28} width={28} className="EiVpKc aoH"><path d="M480-80q-6,0-11-4t-7-10q-17-67-51-126T328-328T220-411T94-462q-6-2-10-7t-4-11t4-11t10-7q67-17 126-51t108-83t83-108t51-126q2-6 7-10t11-4t10.5,4t6.5,10q18,67 52,126t83,108t108,83t126,51q6,2 10,7t4,11t-4,11t-10,7q-67,17-126,51T632-328T549-220T498-94q-2,6-7,10t-11,4Z" />
          </svg>
        </span>
        <div className='cursor-pointer hover:bg-white/10 p-2 rounded-full'>
          <CgMenuGridO size={24} />
        </div>
        <div 
          className="relative size-7 grid place-items-center rounded-full bg-[#dbdbdb] cursor-pointer" 
          onClick={() => setMiniProfile(true)}>
          <img loading="lazy"
            src={user?.user_metadata.image || "/images/default-avatar.webp"}
            alt={user?.user_metadata.user}
            className="size-full rounded-full object-center"
          />
          {miniProfile && (
            <div className="absolute top-0 right-0 py-4 px-5 z-50 bg-[#28242c] rounded-2xl text-center w-[350px] text-black">
              <div className="flex flex-col gap-5">
                <div className=" flex items-center justify-between gap-2 text-sm text-white font-semibold">
                  <div className='size-7'>
                    <img loading="lazy"
                      src={user?.user_metadata.image || "/images/default-avatar.webp"} 
                      alt="" 
                      className="size-full rounded-full"
                    />
                  </div>
                  <p>{user?.user_metadata.email}</p>
                  <div className="hover:bg-[#28282c] p-2 rounded-full cursor-pointer" onClick={() => setMiniProfile(false)}>
                    <IoCloseSharp size={24} className="" />
                  </div>
                </div>
                <div className="text-white space-y-3 text-xl grid place-items-center">
                  <div className='size-20'>
                    <img loading="lazy"
                      src={user?.user_metadata.image || "/images/default-avatar.webp"} 
                      alt={user?.user_metadata.username} 
                      className="size-full rounded-full object-center"
                    />
                  </div>
                  <p className="">
                    Hi, {user?.user_metadata.username}!
                  </p>
                </div>
                <button
                  type="button" 
                  className="flex items-center gap-3 text-white text-lg bg-[#111010d3] hover:bg-[#1c1a1f] px-25 py-3 rounded-4xl cursor-pointer"
                  onClick={handleLogout}
                >
                  <span>
                    <GoSignOut size={20}/>
                  </span>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
