import React from 'react'
import { useEffect, useState } from "react";
import TopNav from "~/components/top-nav";
import MailNavTools from "~/components/mail-nav-tools";
import MailHeader from "~/components/mail-header";
import MailList from "~/components/mail-list";
import MailBody from "~/components/mail-body";
import supabase from "~/lib/supabase";
import type { User } from '@supabase/supabase-js';
import { useAuth } from '~/auth/authContext';
import { type Mail } from "~/lib/types"

// interface Mail {
//   id: string;
//   sender_id: string;
//   receiver_id: string;
//   subject: string;
//   body: string;
//   attachments: { name: string; url: string }[];
//   read: boolean;
//   deleted: boolean;
//   is_draft: boolean;
//   created_at: string;
// }

interface MailPageProps {
  filter: (user: User) => any;
  context: "inbox" | "sent" | "trash" | "draft";
}

export default function MailPage({ filter, context = "inbox" }: MailPageProps) {
  const [openMail, setOpenMail] = useState(false);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [mails, setMails] = useState<Mail[]>([]);
  const { user } = useAuth();

  async function refetch() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) return console.log("No auth user");

      const query = filter(user);

      const { data, error } = await query.select(`
        *,
        sender:sender_id (fullname, email),
        receiver:receiver_id (fullname, email)
        `);

      // const { data, error } = await supabase
      //   .from("mail")
      //   .select(`*,
      //     sender:sender_id (fullname),
      //     receiver:receiver_id (fullname)
      //     `)
      //   .eq("receiver_id", user.id)
      //   .order("created_at", { ascending: false})

      if (error) throw error

      setMails(data as Mail[]);
    } catch (err) {
      console.error("refetcherror", err);
    }
  }

  useEffect(() => {
    refetch();
  }, [filter]);

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const channel = supabase
        .channel("draft-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "mail",
            filter: `sender_id=eq.${user.id}`
          },
          () => {
            refetch();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setup();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("inbox-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "mail",
            filter: `receiver_id=eq.${user.id}`
          },
          () => {
            refetch();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setup();
  }, []);


  async function handleOpenMail(mail: Mail) {
    setSelectedMail(mail);
    setOpenMail(true);
    await supabase
      .from("mail")
      .update({ read: true })
      .eq("id", mail.id);
  };

  return (
    <div className="w-full h-full">
      <TopNav />
      <div className="px-4">
        {!openMail ? (
          <div className="h-[calc(100dvh-86px)] max-h-[calc(100dvh-86px)] overflow-y-auto min-w-[1080px] bg-white/80 rounded-2xl">
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
        ) : (openMail && selectedMail && (
          <div className="h-[calc(100dvh-86px)] max-h-[calc(100dvh-86px)] overflow-y-auto max-w-[1080px] bg-white/80 rounded-2xl">
            <MailBody
              mail={selectedMail}
              onClose={() => setOpenMail(false)}
              context={context}
            />
          </div>
        )
        )}
      </div>
    </div>
  )
}
