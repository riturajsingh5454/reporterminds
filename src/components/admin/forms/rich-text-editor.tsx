"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export function RichTextEditor({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-neutral min-h-[300px] max-w-none p-4 focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_p]:my-2",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-input">
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-secondary/30 p-2">
        <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          onPressedChange={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="size-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="size-3.5" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
