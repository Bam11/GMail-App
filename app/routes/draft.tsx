import type { User } from '@supabase/supabase-js';
import React from 'react'
import MailPage from "~/components/mail-page";
import supabase from "~/lib/supabase";

function draftFilter(user: User) {
  return supabase
    .from("mail")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("is_draft", true)
    .order("created_at", { ascending: false })
}

export default function Draft() {
  return (
    <MailPage filter={draftFilter} context = "draft"/>
  )
}
