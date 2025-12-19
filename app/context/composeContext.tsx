import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import supabase from "~/lib/supabase";
import { useAuth } from "~/auth/authContext";

interface ComposeData {
  recipient?: string[];
  subject?: string;
  body?: string;
}

interface ComposeContextType {
  isOpen: boolean;
  data: ComposeData;
  openCompose: (data?: ComposeData) => void;
  closeCompose: () => void;
  updateData: (data: Partial<ComposeData>) => void;
}

const ComposeContext = createContext<ComposeContextType | null>(null);

export function ComposeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ComposeData>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const { user } = useAuth();

  const updateData = (newData: Partial<ComposeData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  async function createDraft(initialData: ComposeData){
    if(!user) return;

    const { data:inserted, error } = await supabase
      .from("mail")
      .insert({
        subject: initialData.subject || "",
        body: initialData.body || "",
        receiver_id: null,
        sender_id: user.id,
        is_draft: true, 
      })
      .select()
      .single();

    if(!error) {
      setDraftId(inserted.id);
      console.log("Draft created:", inserted.id);
    }
  }

  async function sendDraft() {
    if (!draftId) return;
  await supabase
    .from("mail")
    .update({
      is_draft: false
    })
    .eq("id", draftId);
}

async function discardDraft() {
  if (!draftId) return;
  await supabase
    .from("mail")
    .delete()
    .eq("id", draftId);
}

async function saveDraft () {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (draftId || !user) return

    const recipients = data.recipient ?? [];
    const subject = data.subject ?? "";
    const body = data.body ?? "";

    let receiverIds: string[] = [];

    if (recipients && recipients.length > 0) {
      const { data: receivers, error: receiverError } = await supabase
        .from("user_profile")
        .select("auth_user")
        .in("email", recipients);

      if (receiverError) throw receiverError;

      receiverIds = receivers.map(r => r.auth_user) || [];
    }

    if (!draftId) {

      // if(saveNewDraft) return;

      // setSaveNewDraft(true);

      const { data: inserted, error } = await supabase
        .from("mail")
        .insert({
          sender_id: user.id,
          receiver_id: receiverIds[0] || null, 
          subject,
          body,
          is_draft: true,
        })
        .select()
        .single();
      
      // setSaveNewDraft(false);
      if (error) throw error;

      setDraftId(inserted.id);
      console.log("Draft created:", inserted.id);
      return;
    }

    const { error: updateError } = 
    await supabase
      .from("mail")
      .update({
        subject,
        body,
        receiver_id: receiverIds[0] || null,
      })
      .eq("id", draftId);

    // if (updateError) throw updateError;

    console.log("Draft updated successfully", draftId);
  } catch (err) {
    console.error("Error saving draft:", err);
  }
};


useEffect(() => {
  if (!draftId ||!isOpen) return;

  const timeout = setTimeout(() => saveDraft(), 1000);
  return () => clearTimeout(timeout);
}, [data.subject, data.body, data.recipient, isOpen, draftId]);



  function openCompose(initialData: ComposeData = {}) {
    setIsOpen(true);
    setData(initialData);
    setDraftId(null);

    createDraft(initialData);
  }

  async function closeCompose() {
    if (draftId) {
      const subject = data.subject?.trim() || "";
      const body = data.body?.trim() || "";

      const isEmpty = subject === "" && body === "";

      if (isEmpty) {
        await supabase
          .from("mail")
          .delete()
          .eq("id", draftId);
      }
    }

    setIsOpen(false);
    setData({});
    setDraftId(null);
  }

  return (
    <ComposeContext.Provider value={{ isOpen, data, openCompose, closeCompose, updateData }}>
      {children}
    </ComposeContext.Provider>
  );
}

export function useCompose() {
  const ctx = useContext(ComposeContext);
  if (!ctx) throw new Error("useCompose must be used inside ComposeProvider");
  return ctx;
}