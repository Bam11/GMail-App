import supabase from "~/lib/supabase";

export function MailActions() {
  async function moveToTrash(mailId: string) {
    console.log("MOVE TO TRASH CALLED:", mailId);
    await supabase.from("mail")
      .update({ deleted: true })
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

  return { moveToTrash, restoreMail, deletePermanently, markAsUnread, discardDraft };
}
