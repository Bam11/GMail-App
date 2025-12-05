import React from 'react'
import { useEffect, useState } from "react";
import TopNav from "~/components/top-nav";
import MailNavTools from "~/components/mail-nav-tools";
import MailHeader from "~/components/mail-header";
import MailList from "~/components/mail-list";
import MailBody from "~/components/mail-body";
import supabase from "~/lib/supabase";
import type { User } from '@supabase/supabase-js';

interface Mail {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  body: string;
  attachments: { name: string; url: string }[];
  read: boolean;
  deleted: boolean;
  is_draft: boolean;
  created_at: string;
}

interface MailPageProps {
  filter: (user: User) => any;
  context: "inbox" | "sent" | "trash" | "draft";
}

export default function MailPage({filter, context ="inbox"}: MailPageProps) {
  const [openMail, setOpenMail] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [mails, setMails] = useState<Mail[]>([]);

  useEffect(() => {
    const getMails = async() => {
      try {
        const { data: {user}, error: authError } = await supabase.auth.getUser();

        if(authError) throw authError;
        if(!user) return console.log("No auth user");

        const query = filter(user);

        const { data, error} = await query. select (`
          *,
          sender:sender_id (fullname),
          receiver:receiver_id (fullname)
          `);

        // const { data, error } = await supabase
        //   .from("mail")
        //   .select(`*,
        //     sender:sender_id (fullname),
        //     receiver:receiver_id (fullname)
        //     `)
        //   .eq("receiver_id", user.id)
        //   .order("created_at", { ascending: false})

        if(error) throw error

        setMails(data as Mail[]);
      } catch (err) {
        console.error("error", err);
      }
    };

    getMails();
  }, [filter]);

  const handleOpenMail = (mail: any) => {
    setSelectedMail(mail);
    setOpenMail(true);
  };
  return (
    <div className="w-full h-full">
      <TopNav />
      <div className="px-4">
        {!openMail ? (
          <div className="min-h-[calc(100dvh-86px)] max-w-[1080px] bg-white/80 rounded-2xl">
            <MailNavTools />
            <MailHeader />
            {mails.map(mail => (
              <MailList
                key={mail.id}
                mail={mail} 
                context={context}
                onOpenMail={() => handleOpenMail(mail)} />
            ))}
          </div>
        ) : (
          <div className="min-h-[calc(100dvh-86px)] max-w-[1080px] bg-white/80 rounded-2xl">
            <MailBody onClose={() => setOpenMail(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
