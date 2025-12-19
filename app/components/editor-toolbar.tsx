import React, { useState } from 'react'
import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  MoreVertical,
  Strikethrough,
  Type
} from "lucide-react"

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false);

  // Define the size options
  const fontSizes = [
    { value: "12px", label: "Small" },
    { value: "14px", label: "Normal" },
    { value: "18px", label: "Large" },
    { value: "24px", label: "Huge" },
  ];

  const handleSelectSize = (sizeValue: string) => {
    editor!
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: sizeValue })
      .run();
    setIsOpen(false); // Close the dropdown after selection
  };

  if (!editor) return null
  const btn = "p-1.5 rounded hover:bg-gray-200 outline-none"

  return (
    <div className="absolute z-50 bg-[#f2f6fc] bottom-13 left-5 rounded-2xl flex flex-wrap items-center gap-1 p-1 text-sm">
      <div className="border-r border-gray-400">
        <button
          type="button"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn}
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn}
        >
          <Redo size={16} />
        </button>
      </div>

      <select
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        title="Font"
        className="w-20 text-sm outline-none p-1 hover:bg-gray-200 border-r border-gray-400"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>

      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
            aria-expanded={isOpen}
            aria-haspopup="true"
            title="Font Size"
          >
            <Type size={20} className="font-extrabold" />
          </button>
        </div>
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 bottom-9 mt-2 w-32 rounded-md shadow-lg bg-white z-10"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleSelectSize(size.value)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <select
        className="text-sm border rounded px-1"
        onChange={(e) =>
          editor.chain().focus().setMark("textStyle", {
            fontSize: e.target.value,
          }).run()
        }
      >
        <option value="12px">Small</option>
        <option value="14px">Normal</option>
        <option value="18px">Large</option>
        <option value="24px">Huge</option>
      </select> */}

      <button
        type="button"
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        title="Italics"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn}
      >
        <UnderlineIcon size={16} />
      </button>
      <button
        type="button"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btn}
      >
        <Strikethrough size={16} />
      </button>

      {/* Text color */}
      <input
        type="color"
        className="size-6 border-none"
        title="Text-color"
        onChange={(e) =>
          editor.chain().focus().setColor(e.target.value).run()
        }
      />

      {/* Align */}
      <div className="relative group">
        <button
          type="button"
          title="Align"
          className={`border-r border-gray-400 rounded-none ${btn}`}
        >
          <AlignLeft size={16} />
        </button>
        <div className="absolute right-0 bottom-7 hidden group-hover:flex flex-col bg-white rounded shadow p-2 gap-2">
          <button
            type="button"
            title="Align-Left" 
            className={btn}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={20} />
          </button>
          <button
            type="button"
            title="Align-Center" 
            className={btn} 
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={20} />
          </button>
          <button
            type="button"
            title="Align-Right" 
            className={btn} 
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={20} />
          </button>
          <button
            type="button"
            title="Align-Justify" 
            className={btn} 
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify size={16} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <button
          type="button"
          title="More formatting options" 
          className={btn}
        >
          <MoreVertical size={16} />
        </button>

        <div className="absolute bottom-7 hidden group-hover:flex flex-col gap-2 px-2 bg-white rounded shadow">
          <button
            type="button"
            title="Bulleted list" 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={btn}
          >
            <List size={20} />
          </button>
          <button
            type="button"
            title="Numbered list" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            className={btn}
          >
            <ListOrdered size={20} />
          </button>
          <button 
            type="button"
            title="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            className={btn}
          >
            <img src="/images/quote.png" className="size-5"/>
          </button>
          <button 
            type="button"
            title="Indent more" 
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()} 
            className={btn}
          >
            <img src="/images/indent+.png" className="size-5"/>
          </button>
          <button 
            type="button"
            title="Indent less" 
            onClick={() => editor.chain().focus().liftListItem("listItem").run()} 
            className={btn}
          >
            <img src="/images/indent-" className="size-5"/>
          </button>
        </div>
      </div>
    </div>
  )
}