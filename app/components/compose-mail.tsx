import { useEffect, useState, useRef } from 'react'
import supabase from "~/lib/supabase";
import { useAuth } from '~/auth/authContext';
import { useCompose } from '~/context/composeContext';
import MailEditor from "~/components/editor";
import { Editor } from "@tiptap/react";
import EmojiPicker from 'emoji-picker-react';
import { FaUserCircle } from 'react-icons/fa';
import { FiSmile } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAttachFile, MdMinimize, MdOutlineImage } from 'react-icons/md';
import { PiTextAaBold } from 'react-icons/pi';
import { RiDeleteBin6Line, RiPencilLine } from 'react-icons/ri';
import { MailActions } from '~/lib/mailActions';


export default function ComposeMail({ collapsed }: { collapsed: boolean }) {
  // const [isOpen, setIsOpen] = useState(false);
  // const [recipients, setRecipients] = useState<string[]>([]);
  // const [subject, setSubject] = useState("");
  // const [body, setBody] = useState("");
  const { isOpen, data, openCompose, closeCompose, updateData } = useCompose();

  const [recipients, setRecipients] = useState<string[]>(data.recipient || []);
  const [subject, setSubject] = useState(data.subject || "");
  const [body, setBody] = useState(data.body || "");
  const [CcBcc, setCcBcc] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const { user } = useAuth();
  const savingRef = useRef(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const { moveToTrash } = MailActions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments([...attachments, ...Array.from(e.target.files)]);
    console.log(attachments);
  };

  async function uploadInlineImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("mail-attachments")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("mail-attachments")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  }

  async function handleInsertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (!input.files?.length || !editorRef.current) return;

      const file = input.files[0];
      const imageUrl = await uploadInlineImage(file);

      editorRef.current.chain().focus().setImage({ src: imageUrl }).run();
    };

    input.click();
  }

  const uploadAttachments = async () => {
    const urls: { name: string; url: string }[] = [];

    for (let i = 0; i < attachments.length; i++) {
      const file = attachments[i];
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("mail-attachments")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicData, } = supabase.storage
        .from("mail-attachments")
        .getPublicUrl(fileName);

      urls.push({ name: file.name, url: publicData.publicUrl });
    }

    return urls;
  };

  const handleSend = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return alert("no user");
      const bodyHtml = editorRef.current?.getHTML();

      const { data: receivers, error: receiverError } = await supabase
        .from("user_profile")
        .select("auth_user")
        .in("email", recipients)
      console.log("receivers", receivers);

      if (receiverError || !(receivers.length > 0)) {
        throw new Error("Receipient not found");
      }

      if (draftId) {
        await supabase
          .from("mail")
          .delete()
          .eq("id", draftId);
        setDraftId(null);
      }

      const attachmentUrls = await uploadAttachments();
      const mailData = receivers.map((receiver) => {
        return {
          sender_id: user.id,
          receiver_id: receiver.auth_user,
          subject,
          body: bodyHtml,
          attachments: attachmentUrls,
          read: false,
          deleted: false,
          is_draft: false,
        }
      })
      const { error: mailError } = await supabase
        .from("mail")
        .insert(mailData);

      if (mailError) {
        console.log(mailError);
        alert("Error sending mail")
        throw mailError
      } else (
        alert("Mail Sent Successfully")
      )

      // Reset the form
      setRecipients([]);
      setSubject("");
      setBody("");
      setAttachments([]);
      updateData({ recipient: [], subject: "", body: "" });
      closeCompose();
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Reset local fields when modal opens with new data
  useEffect(() => {
    if (!isOpen) return;
      setRecipients(data.recipient || []);
      setSubject(data.subject || "");
      setBody(data.body || "");
    
  }, [isOpen]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();

      if (trimmed && isValidEmail(trimmed)) {
        const newRecipients = [...recipients, trimmed];
        setRecipients([...recipients, trimmed]);
        setInputValue("");
      }
    }
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();

    if (trimmed && isValidEmail(trimmed)) {
      setRecipients([...recipients, trimmed]);
      setInputValue("");
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const commitRecipient = () => {
    const trimmed = inputValue.trim();

    if (trimmed && isValidEmail(trimmed)) {
      setRecipients(prev => [...prev, trimmed]);
    }
    setInputValue("");
  }

  const handleClose = async () => {
    if (
      recipients.length === 0 &&
      subject.trim() === "" &&
      body.trim() === "" &&
      draftId
    ) {
      await supabase
        .from("mail")
        .delete()
        .eq("id", draftId);
    }

    setDraftId(null);
    savingRef.current = false;
    closeCompose();
  }

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setInterval(async () => {
      if (!user) return;

      const allEmpty =
        recipients.length === 0 &&
        subject.trim() === "" &&
        body.trim() === "";

      if (allEmpty) {
        if (draftId) {
          await supabase
            .from("mail")
            .delete()
            .eq("id", draftId);
          setDraftId(null);
          savingRef.current = false;
        }
        return;
      }

      if (!draftId && !savingRef.current) {
        savingRef.current = true;

        const { data: inserted, error } = await supabase
          .from("mail")
          .insert({
            sender_id: user?.id,
            receiver_id: null,
            subject,
            body,
            is_draft: true,
          })
          .select()
          .single();

        if (!error) {
          setDraftId(inserted.id);
        }

        savingRef.current = false;
        return;
      }

      if (draftId) {
        await supabase
          .from("mail")
          .update({
            subject,
            body,
            receiver_id: null,
          })
          .eq("id", draftId);
      }
    }, 500);

    return () => clearInterval(timeout);
  }, [recipients, subject, body, isOpen, draftId, user]);

  useEffect(() => {
  console.log("ComposeMail mounted");
  return () => console.log("ComposeMail unmounted");
}, []);


  return (
    <>
      <button
        type="button"
        className={`bg-white text-black/60 flex items-center w-fit gap-4  px-4.5 py-2.5 rounded-2xl outline-none hover:cursor-pointer `}
        onClick={() => openCompose({})}
      >
        {collapsed ? (
          <RiPencilLine size={20} />
        ) : (
          <>
            <RiPencilLine size={20} />
            <span>Compose</span>
          </>
        )}

      </button>

      {isOpen && (
        <div className="fixed bottom-0 right-10 z-9999 bg-white text-black w-[460px] max-h-[90vh] rounded-t-md flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-t-md cursor-pointer">
            <p className="text-[#041e49] text-sm font-semibold ">
              New Message
            </p>
            <div className="flex items-center gap-1.5 text-[#202124] text-sm">
              <MdMinimize size={18} className="cursor-pointer" />
              <IoCloseSharp size={18} className="cursor-pointer" onClick={handleClose} />
            </div>
          </div>
          <div className="px-4 flex-1 overflow-y-auto">
            {CcBcc === false
              ? (
                <input
                  type="text"
                  placeholder="Recipients"
                  value={
                    recipients.length > 0
                      ? recipients.join(",")
                      : inputValue
                  }
                  onChange={(e) => setInputValue(e.target.value)}
                  readOnly
                  className="border-b border-[#8080805d] w-full placeholder:text-[#747775] text-sm outline-none py-2"
                  onClick={() => { setCcBcc(true) }}
                />
              ) : (
                <div className="flex flex-wrap items-center text-sm text-[#747775] border-b border-[#8080805d] gap-3 py-1">
                  <span className="hover:underline">To</span>
                  {recipients.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 rounded-full px-2 py-1 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-1">
                        <FaUserCircle size={20} />
                      </div>
                      <span>{email}</span>
                      <button
                        onClick={() => removeRecipient(index)}
                        className="ml-2 text-gray-600 hover:text-black"
                      >
                        <IoCloseSharp size={18} className="cursor-pointer" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder=""
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="w-full placeholder:text-[#747775] text-black text-sm outline-none py-2 flex-1 min-w-[120px]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="hover:underline">Cc</span>
                    <span className="hover:underline">Bcc</span>
                  </div>
                </div>
              )}
          </div>
          <div
            className="px-4"
            onClick={() => {
              commitRecipient();
              setCcBcc(false);
            }}
          >
            <input
              type="text"
              placeholder="Subject"
              className="border-b border-[#8080805d] w-full placeholder:text-[#747775] text-sm outline-none py-2"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                updateData({ subject: e.target.value })
              }}
            />
          </div>
          <div
            className="px-4 py-2"
            onClick={() => {
              commitRecipient()
              setCcBcc(false);
            }}
          >
            <MailEditor
              className={`w-full h-90 resize-none outline-none text-[#222] text-[13px] font-normal`}
              ref={editorRef}
              value={body}
              showFormatting={showFormatting}
              onChange={(html) => {
                setBody(html);
                updateData({ body: html })
              }}
            />
          </div>
          <div className="px-4 mb-2 flex items-center justify-between text-[#444]">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="py-1.5 px-6 bg-[#0b57d0] text-white rounded-2xl text-sm font-semibold cursor-pointer"
                onClick={handleSend}
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setShowFormatting(v => !v)}
                className="cursor-pointer bg-[#d3e3fd] p-1.5 rounded-full">
                <PiTextAaBold size={20} />
              </button>
              <div>
                <input
                  type="file"
                  id="file-upload"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer relative">
                  <MdAttachFile size={19} />
                </label>
                {attachments.length > 0 && (
                  <div className="absolute bottom-10 left-0 flex flex-wrap gap-2 py-2 px-4">
                    {attachments.map((file, index) => (
                      <div
                        className="flex items-center gap-1 bg-gray-200 px-2 py-1 text-xs rounded-full"
                        key={index}
                      >
                        <MdAttachFile size={12} />
                        <span>{file.name}</span>
                        <button
                          type="button"
                          className=""
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        >
                          <IoCloseSharp size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="cursor-pointer">
                <FiSmile size={18} />
                {/* <EmojiPicker /> */}
              </span>
              <div>
                <button
                  className="grid place-items-center"
                  type="button"
                  onClick={handleInsertImage}
                >
                  <MdOutlineImage size={18} />
                </button>
                {/* <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <MdOutlineImage size={18} />
                </label> */}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (draftId) moveToTrash(draftId)
                console.log("draftID", draftId)
              }}
              className="cursor-pointer"
            >
              <RiDeleteBin6Line size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}