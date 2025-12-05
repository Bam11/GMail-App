import { useState } from 'react'
import supabase from "~/lib/supabase";
import EmojiPicker from 'emoji-picker-react';
import { FaUserCircle } from 'react-icons/fa';
import { FiSmile } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAttachFile, MdMinimize, MdOutlineImage } from 'react-icons/md';
import { PiTextAaBold } from 'react-icons/pi';
import { RiDeleteBin6Line, RiPencilLine } from 'react-icons/ri'

export default function ComposeMail() {
  const [isOpen, setIsOpen] = useState(false);
  const [CcBcc, setCcBcc] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments([...attachments, ...Array.from(e.target.files)]);
    console.log(attachments);
  };

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

      const { data: receivers, error: receiverError } = await supabase
        .from("user_profile")
        .select("auth_user")
        .in("email", recipients)
      console.log("receivers", receivers);

      if (receiverError || !(receivers.length > 0)) {
        throw new Error("Receipient not found");
      }

      const attachmentUrls = await uploadAttachments();
      const mailData = receivers.map((receiver) => {
        return {
          sender_id: user.id,
          receiver_id: receiver.auth_user,
          subject,
          body,
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
        alert ("Mail Sent Successfully")
      )

      // Reset the form
      setRecipients([]);
      setSubject("");
      setBody("");
      setAttachments([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();

      if (trimmed && trimmed.includes("@")) {
        setRecipients([...recipients, trimmed]);
        setInputValue("");
      }
    }
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();

    if (trimmed && trimmed.includes("@")) {
      setRecipients([...recipients, trimmed]);
      setInputValue("");
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };



  return (
    <>
      <button
        type="button"
        className="bg-white text-black/60 flex items-center w-fit gap-4  px-4.5 py-2.5 rounded-2xl outline-none hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <RiPencilLine size={20} />
        Compose
      </button>

      {isOpen && (
        <div className="fixed bottom-0 right-10 z-9999 bg-white text-black w-[460px] max-h-[445px] rounded-t-md">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-t-md cursor-pointer">
            <p className="text-[#041e49] text-sm font-semibold ">
              New Message
            </p>
            <div className="flex items-center gap-1.5 text-[#202124] text-sm">
              <MdMinimize size={18} className="cursor-pointer" />
              <IoCloseSharp size={18} className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
          </div>
          <div className="px-4">
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
          <div className="px-4" onClick={() => setCcBcc(false)}>
            <input
              type="text"
              placeholder="Subject"
              className="border-b border-[#8080805d] w-full placeholder:text-[#747775] text-sm outline-none py-2"
              value={subject}
              onChange={(e) => { setSubject(e.target.value) }}
            />
          </div>
          <div className="px-4 py-2" onClick={() => setCcBcc(false)}>
            <textarea
              name=""
              id=""
              className="w-full h-66 resize-none outline-none text-[#222] text-[13px] font-normal"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="px-4 flex items-center justify-between text-[#444]">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="py-1.5 px-6 bg-[#0b57d0] text-white rounded-2xl text-sm font-semibold cursor-pointer"
                onClick={handleSend}
              >
                Send
              </button>
              <span className="cursor-pointer">
                <PiTextAaBold size={20} />
              </span>
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
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <MdOutlineImage size={18} />
                </label>
              </div>
            </div>
            <div className="cursor-pointer">
              <RiDeleteBin6Line size={18} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}