"use client"

import React, { useState } from "react"
import { useEditor, EditorContent, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import { TextStyle } from "@tiptap/extension-text-style"
import { Extension } from "@tiptap/core"
import { Icon } from "@iconify/react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { sendEmailCampaign } from "@/actions/campaigns"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import ToolbarButton from "../buttons/ToolbarButton"

const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return { types: ["textStyle"] }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) return {}
                            return { style: `font-size: ${attributes.fontSize}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => chain().setMark("textStyle", { fontSize }).run(),
            unsetFontSize: () => ({ chain }) => chain().setMark("textStyle", { fontSize: null }).run(),
        }
    },
})

type EditorMode = "campaign" | "single"

interface EmailTemplateEditorProps {
    open: boolean
    setOpen: (open: boolean) => void
    mode?: EditorMode
    eventID?: string
    campaignName?: string
    recipientEmail?: string
    onClose?: () => void
    recipientName?: string
}

export default function EmailTemplateEditor({
    open,
    setOpen,
    mode = "campaign",
    recipientEmail = "",
    eventID,
    campaignName,
    onClose,
}: EmailTemplateEditorProps) {

    const dispatch = useAppDispatch()
    const { trigger } = useRevalidate("marketing")
    const { user } = useAppSelector(store => store.authUser)

    const [recipient, setRecipient] = useState(recipientEmail)
    const [subject, setSubject] = useState("")
    const [isSending, setIsSending] = useState(false)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily,
            FontSize,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none max-w-none p-4 min-h-[300px]",
            },
        },
    })

    const handleClose = () => {
        editor?.commands.clearContent()
        setRecipient(recipientEmail)
        setSubject("")
        setOpen(false)
        onClose?.()
    }

    const handleSend = async () => {
        const html = editor?.getHTML() ?? ""

        if (!subject.trim()) {
            dispatch(showAlert({ variant: "destructive", title: "Missing subject", description: "Please enter a subject." }))
            return
        }
        if (!html || html === "<p></p>") {
            dispatch(showAlert({ variant: "destructive", title: "Empty message", description: "Please write your email content." }))
            return
        }
        if (mode === "campaign" && !eventID?.trim()) {
            dispatch(showAlert({ variant: "destructive", title: "Missing event", description: "Please enter the event ID." }))
            return
        }
        if (mode === "single" && !recipient.trim()) {
            dispatch(showAlert({ variant: "destructive", title: "Missing recipient", description: "Please enter a recipient email." }))
            return
        }

        setIsSending(true)

        const senderName = user?.business_name ?? user?.full_name ?? "Host"
        const senderEmail = user?.email ?? ""

        let result: any

        if (mode === "campaign") {
            result = await sendEmailCampaign({
                event_id: eventID ?? "",
                campaign_name: campaignName || subject,
                subject,
                html_content: html,
                sender_name: senderName,
                sender_email: senderEmail,
            })
        } else {
            const { sendSingleEmail } = await import("@/actions/campaigns")
            result = await sendSingleEmail({
                recipient_email: recipient,
                subject,
                html_content: html,
                sender_name: senderName,
                sender_email: senderEmail,
            })
        }

        setIsSending(false)

        if (result.success) {
            handleClose()
            dispatch(openSuccessModal({
                title: mode === "campaign" ? "Campaign Sent!" : "Email Sent!",
                description: result.message ?? "Your campaign email has been delivered.",
                variant: "success",
            }))

            mode === "campaign" && trigger()
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Failed to send",
                description: result.message ?? "Something went wrong. Please try again.",
            }))
        }
    }
    

    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            const editorInstance = ctx.editor
            if (!editorInstance) return {
                isBold: false, isItalic: false, isUnderline: false,
                isBulletList: false, isOrderedList: false,
                alignLeft: false, alignCenter: false, alignRight: false,
            }

            const currentAlignment = editorInstance.getAttributes('paragraph').textAlign 
                || editorInstance.getAttributes('heading').textAlign 
                || 'left'

            return {
                isBold:        editorInstance.isActive("bold"),
                isItalic:      editorInstance.isActive("italic"),
                isUnderline:   editorInstance.isActive("underline"),
                isBulletList:  editorInstance.isActive("bulletList"),
                isOrderedList: editorInstance.isActive("orderedList"),
                alignLeft:     currentAlignment === "left",
                alignCenter:   currentAlignment === "center",
                alignRight:    currentAlignment === "right",
            }
        },
        ...(editor ? { dependencies: [editor] } : {}),
    })

    if (!editor) return null


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent showCloseButton={false} className="max-w-2xl p-0 overflow-hidden h-[90vh] border-none gap-0 flex flex-col">
                <div className="bg-brand-secondary-9 h-12 flex items-center justify-between px-4 text-white shrink-0">
                    <DialogTitle className="text-sm font-medium">
                        {mode === "campaign" ? "New Campaign" : "New Email"}
                    </DialogTitle>
                    <button onClick={handleClose} className="hover:bg-white/10 p-1 rounded transition-colors">
                        <Icon icon="hugeicons:cancel-01" width="20" height="20" />
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden bg-white">
                    <div className="px-4 py-1 shrink-0 border-b">
                        {mode === "single" && (
                            <div className="flex items-center gap-2 border-b py-2 text-sm">
                                <span className="text-neutral-400 w-28 shrink-0">To</span>
                                <input
                                    value={recipient}
                                    onChange={e => setRecipient(e.target.value)}
                                    placeholder="recipient@email.com"
                                    className="flex-1 outline-none text-sm"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 py-2 text-sm">
                            <span className="text-neutral-400 w-28 shrink-0">Subject</span>
                            <input
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="Email subject..."
                                className="flex-1 outline-none text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 py-2 text-sm border-t">
                            <span className="text-neutral-400 w-28 shrink-0">From</span>
                            <span className="text-xs text-brand-secondary-6">
                                {user?.business_name ?? user?.full_name ?? "—"} &lt;{user?.email ?? "—"}&gt;
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <EditorContent editor={editor} />
                    </div>

                    <div className="p-3 border-t space-y-3 shrink-0">
                        <div className="flex flex-wrap items-center gap-1 p-1 bg-brand-neutral-3 rounded-lg border w-fit">
                            <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                                <Icon icon="hugeicons:undo-03" width="18" />
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                                <Icon icon="hugeicons:redo-03" width="18" />
                            </ToolbarButton>

                            <Divider />

                            <select
                                className="text-xs bg-transparent outline-none cursor-pointer px-1 font-medium"
                                onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                            >
                                <option value="Montserrat">Montserrat</option>
                                <option value="Arial">Arial</option>
                                <option value="Courier New">Courier</option>
                            </select>

                            <Divider />

                            <select
                                className="text-xs bg-transparent outline-none cursor-pointer px-1 font-medium"
                                onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
                                defaultValue=""
                            >
                                <option value="" disabled>Size</option>
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="24px">24px</option>
                                <option value="32px">32px</option>
                            </select>

                            <Divider />

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                active={editorState?.isBold}
                            >
                                <Icon icon="hugeicons:text-bold" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                active={editorState?.isItalic}
                            >
                                <Icon icon="hugeicons:text-italic" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                active={editorState?.isUnderline}
                            >
                                <Icon icon="hugeicons:text-underline" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                active={editorState?.alignLeft}
                            >
                                <Icon icon="hugeicons:text-align-left" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                active={editorState?.alignCenter}
                            >
                                <Icon icon="hugeicons:text-align-center" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                active={editorState?.alignRight}
                            >
                                <Icon icon="hugeicons:text-align-right" width="18" />
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                active={editorState?.isBulletList}
                            >
                                <Icon icon="hugeicons:list-ul" width="18" />
                            </ToolbarButton>

                            {/* <ToolbarButton
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                active={editorState?.isOrderedList}
                            >
                                <Icon icon="hugeicons:list-view" width="18" />
                            </ToolbarButton> */}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSend}
                                    disabled={isSending}
                                    className="bg-brand-primary-6 text-white px-7 py-2.5 rounded-md font-semibold text-sm hover:bg-brand-primary-7 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSending ? (
                                        <>
                                            <Icon icon="svg-spinners:ring-resize" className="w-4 h-4" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="lucide:send" width="16" />
                                            Send
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={handleClose}
                                disabled={isSending}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            >
                                <Icon icon="hugeicons:delete-02" className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Divider() {
    return <div className="w-px h-4 bg-brand-neutral-5 mx-1" />
}