import supabase from "~/lib/supabase";
import { useCompose } from "~/context/composeContext";

export function MailActions() {
  const { openCompose } = useCompose();

  async function getMail(mailId: string) {
    const { data, error } = await supabase
      .from("mail")
      .select(`
          id,
          subject,
          body,
          sender_id (
            email,
            auth_user
          ),
          receiver_id (
            email,
            auth_user
          )
        `)
      .eq("id", mailId)
      .single();

    if (error) throw error;

    return {
      ...data,
      sender: data.sender_id || [],
      receiver: data.receiver_id || [],
    };
  }

  async function reply(mailId: string) {
    const mail = await getMail(mailId);

    openCompose({
      recipient: [mail.sender[0]?.email || ""],
      subject: `Re: ${mail.subject}`,
      body: `\n\n---------- Original Message ----------\n${mail.body}`,
    });
  }

  async function replyAll(mailId: string) {
    const mail = await getMail(mailId);

    openCompose({
      recipient: [
        mail.sender[0]?.email || "", 
        mail.receiver[0]?.email || "",
      ],
      subject: `Re: ${mail.subject}`,
      body: `\n\n---------- Original Message ----------\n${mail.body}`,
    });
  }

  async function forward(mailId: string) {
    const mail = await getMail(mailId);

    openCompose({
      recipient: [],
      subject: `Fwd: ${mail.subject}`,
      body: `\n\n---------- Forwarded Message ----------\n${mail.body}`,
    });
  }

  async function moveToTrash(mailId: string) {
    await supabase.from("mail")
      .update({ 
        deleted: true,
        is_draft: false, 
      })
      .eq("id", mailId);
  }

  async function restoreMail(mailId: string) {
    await supabase.from("mail")
      .update({ deleted: false })
      .eq("id", mailId);
  }

  async function deletePermanently(mailId: string) {
    await supabase.from("mail")
      .delete()
      .eq("id", mailId);
  }

  async function markAsUnread(mailId: string) {
    await supabase.from("mail")
      .update({ read: false })
      .eq("id", mailId)
  }

  async function discardDraft(mailId: string) {
    await supabase.from("mail")
      .delete()
      .eq("id", mailId);
  }

  return {
    reply,
    replyAll,
    forward,
    moveToTrash,
    restoreMail,
    deletePermanently,
    markAsUnread,
    discardDraft
  };
};