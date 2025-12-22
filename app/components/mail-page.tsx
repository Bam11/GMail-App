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
  const { user } = useAuth();

  const [openMail, setOpenMail] = useState(false);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"oldest"|"newest">("newest");

  const [mails, setMails] = useState<Mail[]>([]);
  const [totalMail, setTotalMail] = useState(0);

  const pages = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const from = (currentPage - 1) * pages;
  const to = from + pages - 1;

  const start = totalMail === 0 ? 0 : from + 1;
  const end = Math.min(to + 1, totalMail);


  async function refetch() {
    try {
      // const { data: { user }, error: authError } = await supabase.auth.getUser();

      // if (authError) throw authError;
      if (!user) return console.log("No user");
      const hasSearch = searchText.trim().length > 0;
      const term = `%${searchText}%`;

      let countQuery = supabase
        .from("mail")
        .select("id", { count: "exact" })
        .match(
          context === "inbox"
            ? { receiver_id: user.id, deleted: false }
            : context === "sent"
              ? { sender_id: user.id, deleted: false }
              : context === "trash"
                ? { deleted: true }
                : { sender_id: user.id, is_draft: true }
        );

      if (hasSearch) {
        countQuery = countQuery.or(
          `subject.ilike.${term},body.ilike.${term}`
        );
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;


      let dataQuery = supabase
        .from("mail")
        .select(`
            *,
            sender:sender_id (fullname, email),
            receiver:receiver_id (fullname, email)
          `,
        )
        .match(
          context === "inbox"
            ? { receiver_id: user.id, deleted: false }
            : context === "sent"
              ? { sender_id: user.id, deleted: false }
              : context === "trash"
                ? { deleted: true }
                : { sender_id: user.id, is_draft: true }
        )
        .order("created_at", { ascending: sortOrder === "oldest" })
        .range(from, to);

      // const { data, error } = await supabase
      //   .from("mail")
      //   .select(`*,
      //     sender:sender_id (fullname),
      //     receiver:receiver_id (fullname)
      //     `)
      //   .eq("receiver_id", user.id)
      //   .order("created_at", { ascending: false})


      if (hasSearch) {
        dataQuery = dataQuery.or(
          `subject.ilike.${term},body.ilike.${term}`
        );
      }

      const { data, error } = await dataQuery;

      if (error) throw error

      setMails(data as Mail[]);
      setTotalMail(count ?? 0);
    } catch (err) {
      console.error("refetcherror", err);
    }
  }

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [filter, user, currentPage, searchText, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [context]);

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
  }, [user, currentPage]);


  async function handleOpenMail(mail: Mail) {

    setMails(prev => 
      prev.map(m => 
        m.id === mail.id ? { ...m, read: true} :m
      )
    );

    setSelectedMail({ ...mail, read:true });
    setOpenMail(true);
    
    await supabase
      .from("mail")
      .update({ read: true })
      .eq("id", mail.id);
  };

  if (!user) return null;
  
  return (
    <div className="w-full h-full">
      <TopNav
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      <div className="px-4">
        {!openMail ? (
          <div className="h-[calc(100dvh-86px)] max-h-[calc(100dvh-86px)] overflow-y-auto min-w-[1080px] bg-white/80 rounded-2xl">
            <MailNavTools
              onRefresh={refetch}
              start={start}
              end={end}
              total={totalMail}
              currentPage={currentPage}
              onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
              onNext={() => {
                if (end < totalMail) {
                  setCurrentPage(p => p + 1);
                }
              }}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
            <MailHeader />
            {mails.map(mail => (
              <MailList
                key={mail.id}
                mail={mail}
                context={context}
                searchText={searchText}
                onOpenMail={() => handleOpenMail(mail)} />
            ))}
          </div>
        ) : (openMail && selectedMail && (
          <div className="h-[calc(100dvh-86px)] max-h-[calc(100dvh-86px)] overflow-y-auto max-w-[1080px] bg-white/80 rounded-2xl">
            <MailBody
              mail={selectedMail}
              onClose={() => setOpenMail(false)}
              currentPage={currentPage}
              context={context}
              start={start}
              end={end}
              total={totalMail}
              onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
              onNext={() => {
                if (end < totalMail) {
                  setCurrentPage(p => p + 1);
                }
              }}
            />
          </div>
        )
        )}
      </div>
    </div>
  )
}