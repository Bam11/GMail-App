import type { Route } from "./+types/home";
import supabase from "~/lib/supabase";
import MailPage from "~/components/mail-page";
import type { User } from '@supabase/supabase-js';



export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Inbox (9,819)" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function inboxFilter(user: User) {
  return supabase
    .from("mail")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("deleted", false)
    .order("created_at", { ascending: false })
}


export default function Home() {
  return (
    <MailPage filter={inboxFilter} context = "inbox"/>
  );
}
