import React from 'react'
import type { User } from '@supabase/supabase-js';
import MailPage from "~/components/mail-page";
import supabase from "~/lib/supabase";

function sentFilter(user: User) {
  return supabase
    .from("mail")
    .select("*")
    .eq("sender_id", user.id)
    .eq("deleted", false)
    .order("created_at", { ascending: false })
}

export default function Sent() {
  return (
    <MailPage filter={sentFilter} context = "sent"/>
  )
}
