import React from 'react'
import type { User } from '@supabase/supabase-js';
import MailPage from "~/components/mail-page";
import supabase from "~/lib/supabase";

function trashFilter(user: User) {
  return supabase
    .from("mail")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("deleted", true)
    .order("created_at", { ascending: false })
}

export default function Trash() {
  return (
    <MailPage filter={trashFilter} context = "trash"/>
  )
}
