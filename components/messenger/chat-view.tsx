'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  MoreVertical,
  ArrowLeft,
  Send,
  Plus,
  Smile,
  CheckCheck,
  Sparkles,
  Users,
  X,
  Copy,
  Hash,
  UserMinus,
  Image,
  Edit
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatThread } from "./types";
import { translations, Language } from "@/lib/translations";

const getSenderNameColor = (name: string) => {
  const colors = [
    'text-orange-400',
    'text-purple-400',
    'text-yellow-400',
    'text-emerald-400',
    'text-pink-400',
    'text-sky-400',
    'text-indigo-400',
    'text-rose-400',
    'text-teal-400',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const containsTibetan = (text: string): boolean => {
  return /[\u0F00-\u0FFF]/.test(text);
};

interface ChatViewProps {
  activeChat: ChatThread;
  msgText: string;
  onMsgTextChange: (val: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  onBackClick?: () => void; // only needed on mobile layout
  lang: Language;
  onUpdateRoomDetails?: (roomId: string, updates: { name?: string; topic?: string; avatarFile?: File }) => Promise<void>;
  onInviteUser?: (roomId: string, userId: string) => Promise<void>;
  onRemoveUser?: (roomId: string, userId: string) => Promise<void>;
  onLeaveRoom?: (roomId: string) => Promise<void>;
}

export default function ChatView({
  activeChat,
  msgText,
  onMsgTextChange,
  onSendMessage,
  isTyping,
  onBackClick,
  lang,
  onUpdateRoomDetails,
  onInviteUser,
  onRemoveUser,
  onLeaveRoom
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRoomDetails, setShowRoomDetails] = useState<boolean>(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(activeChat.name);
  const [editTopic, setEditTopic] = useState(activeChat.topic || '');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [inviteId, setInviteId] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Initialize edit fields when activeChat changes or editing starts
  useEffect(() => {
    setEditName(activeChat.name);
    setEditTopic(activeChat.topic || '');
    setEditAvatarFile(null);
    setEditAvatarPreview(null);
    setIsEditingDetails(false);
    setInviteId('');
  }, [activeChat.id]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRoomDetails = async () => {
    if (!onUpdateRoomDetails) return;
    setIsSavingDetails(true);
    try {
      await onUpdateRoomDetails(activeChat.id, {
        name: editName,
        topic: editTopic,
        avatarFile: editAvatarFile || undefined
      });
      setIsEditingDetails(false);
      setEditAvatarFile(null);
    } catch (err) {
      alert(lang === 'en' ? "Failed to save room details." : "གླེང་མོལ་ཁང་གི་གནས་ཚུལ་ཉར་ཚགས་མ་ཐུབ།");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleInviteUserAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim() || !onInviteUser) return;
    setIsInviting(true);
    try {
      await onInviteUser(activeChat.id, inviteId.trim());
      setInviteId('');
    } catch (err: any) {
      alert(lang === 'en' ? `Failed to invite user: ${err?.message || 'Unknown'}` : `གདན་འདྲེན་ཞུ་མ་ཐུབ།: ${err?.message || 'བྱུང་མིན།'}`);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUserAction = async (memberId: string) => {
    if (!onRemoveUser) return;
    if (confirm(lang === 'en' ? `Are you sure you want to remove this member?` : `ཚོགས་མི་འདི་ཕྱིར་འབུད་བྱེད་དམ།`)) {
      try {
        await onRemoveUser(activeChat.id, memberId);
      } catch (err: any) {
        alert(lang === 'en' ? `Failed to remove user: ${err?.message || 'Unknown'}` : `ཚོགས་མི་ཕྱིར་འབུད་མ་ཐུབ།: ${err?.message || 'བྱུང་མིན།'}`);
      }
    }
  };

  const handleLeaveRoomAction = async () => {
    if (!onLeaveRoom) return;
    const confirmMsg = activeChat.isAdmin
      ? (lang === 'en' ? 'Are you sure you want to destroy (leave) this room? If you are the last member, it will be removed.' : 'གླེང་མོལ་ཁང་འདི་མེད་པར་བཟོ་འམ། གལ་ཏེ་ཁྱེད་རང་མཐའ་མའི་ཚོགས་མི་ཡིན་ན་གླེང་མོལ་ཁང་འདི་མེད་པར་ཆགས་རྒྱུ་རེད།')
      : (lang === 'en' ? 'Are you sure you want to leave this room?' : 'གླེང་མོལ་ཁང་འདི་ནས་ཐོན་པར་གཏན་འཁེལ་ལམ།');

    if (confirm(confirmMsg)) {
      try {
        await onLeaveRoom(activeChat.id);
        setShowRoomDetails(false);
      } catch (err: any) {
        alert(lang === 'en' ? `Failed to leave room: ${err?.message || 'Unknown'}` : `གླེང་མོལ་ཁང་ནས་ཐོན་མ་ཐུབ།: ${err?.message || 'བྱུང་མིན།'}`);
      }
    }
  };

  useEffect(() => {
    // Auto Scroll to Bottom on message change
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, isTyping]);

  useEffect(() => {
    // Hide details panel by default when shifting rooms
    setShowRoomDetails(false);
  }, [activeChat.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="flex h-full w-full bg-card text-card-foreground overflow-hidden">
      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col h-full min-w-0 border-r border-muted/20">

        {/* Active Conversation Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-card/90 backdrop-blur-md z-10 w-full">
          <div
            onClick={() => setShowRoomDetails(!showRoomDetails)}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none hover:opacity-90 active:scale-99 transition"
          >
            {onBackClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggling details
                  if (onBackClick) onBackClick();
                }}
                className="p-1 hover:bg-muted rounded-full shrink-0 md:hidden"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
            )}

            <div className="relative">
              <Avatar className={`h-9 w-9 border border-muted-foreground/10 transition-all ${activeChat.isGroup ? 'rounded-xl' : 'rounded-full'
                }`}>
                <AvatarImage
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className={`object-cover ${activeChat.isGroup ? 'rounded-xl' : 'rounded-full'}`}
                />
                <AvatarFallback className={`text-xs font-bold transition-all ${activeChat.isGroup
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100 rounded-xl'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 rounded-full'
                  }`}>
                  {activeChat.initials || activeChat.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!activeChat.isGroup && (
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card ${activeChat.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                  }`} />
              )}
            </div>

            <div className="min-w-0 leading-tight">
              <h4 className="font-bold text-xs truncate text-foreground flex items-center gap-1">
                {activeChat.isGroup ? (
                  <Hash className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                ) : null}
                <span className="truncate">{activeChat.name}</span>
              </h4>
              <span className="text-[10px] text-muted-foreground block">
                {activeChat.isGroup
                  ? (lang === 'en' ? `${activeChat.members?.length || 0} members` : `ཚོགས་མི་ ${activeChat.members?.length || 0}`)
                  : (isTyping ? (lang === 'en' ? 'typing...' : 'འབྲི་བཞིན་པ།...') : activeChat.online === true ? (lang === 'en' ? 'Online' : 'དྲ་ཐོག་ཏུ་ཡོད་པ།') : (lang === 'en' ? 'Offline' : 'དྲ་མེད།'))}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              className={`p-1.5 hover:bg-muted rounded-full transition ${showRoomDetails ? 'text-brand bg-brand-light text-brand-light-foreground' : 'text-muted-foreground'}`}
              title={lang === 'en' ? "Room details & members" : "གླེང་མོལ་ཁང་གི་གནས་ཚུལ།"}
            >
              <Users className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full text-muted-foreground" title={lang === 'en' ? "More options" : "སྒྲིག་བཀོད་གཞན།"}>
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream area with custom scroll */}
        <ScrollArea className="flex-1 w-full bg-muted/10">
          <div className="px-4 py-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[9px] tracking-wide bg-muted text-muted-foreground py-0.5 px-2.5 rounded-full font-semibold uppercase">
                Today
              </span>
            </div>

            {activeChat.messages.map((m, idx) => {
              const isMe = m.sender === 'me';

              // Get initials for fallback
              const initials = m.senderName
                ? m.senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'U';

              return (
                <div key={idx} className={`flex items-end gap-2.5 w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Sender Avatar */}
                  <Avatar className="h-8 w-8 border border-muted-foreground/10 shrink-0 rounded-full">
                    {m.senderAvatar ? (
                      <AvatarImage src={m.senderAvatar} alt={m.senderName || 'User'} className="object-cover rounded-full" />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold rounded-full">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and Bubble Container */}
                  <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Chat Bubble */}
                    {m.isImage ? (
                      <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md border hover:border-brand/40 transition duration-300 border-muted">
                        <div className="bg-[#0f172a] p-3 text-white">
                          {m.senderName && !isMe && (
                            <span className={`text-[11px] font-bold mb-2 block select-none ${getSenderNameColor(m.senderName)}`}>
                              {m.senderName}
                            </span>
                          )}

                          <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-800">
                            <span className="font-mono text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                              <Sparkles className="w-3 h-3 text-yellow-400" />
                              DASHBOARD_LIVE_METRICS
                            </span>
                            <span className="text-[8px] bg-slate-500/20 text-slate-300 px-1.5 py-0.2 rounded font-bold">SYSTEM</span>
                          </div>

                          <div className="p-2.5 bg-slate-900 rounded-lg border border-indigo-500/20">
                            <div className="flex gap-1.5 mb-2.5">
                              <div className="flex-1 h-3.5 rounded bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div>
                              </div>
                              <div className="flex-1 h-3.5 rounded bg-[#a655ac]/10 border border-[#a655ac]/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                              <div className="h-11 bg-slate-850 rounded flex items-center justify-center relative border border-slate-800">
                                <div className="w-7 h-7 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                                <span className="absolute text-[8px] text-indigo-400 font-bold">84%</span>
                              </div>
                              <div className="col-span-2 h-11 bg-slate-850 rounded p-1.5 flex items-end gap-1 justify-around border border-slate-800">
                                <div className="w-1 h-7 bg-emerald-400 rounded-lg"></div>
                                <div className="w-1 h-9 bg-indigo-400 rounded-lg animate-bounce"></div>
                                <div className="w-1 h-5 bg-purple-400 rounded-lg"></div>
                                <div className="w-1.5 h-[34px] bg-brand rounded-lg"></div>
                              </div>
                            </div>
                            <span className="block text-[8px] text-slate-500 font-mono text-center">AUTO_PERSIST=OK • PORT=3000</span>
                          </div>
                        </div>

                        <div className="bg-muted p-2 text-[10px] text-muted-foreground flex justify-between items-center gap-2">
                          <span className="truncate max-w-[130px]">Dashboard_Mock_Layout.png</span>
                          <div className="flex items-center gap-1 shrink-0 select-none">
                            <span className="text-[8px] text-muted-foreground">{m.time}</span>
                            {isMe && <CheckCheck className="h-3.5 w-3.5 text-brand" />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`px-2 py-2 rounded-xl text-xs leading-relaxed shadow-xs transition duration-200 flex flex-col ${isMe
                          ? 'bg-brand text-brand-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                          }`}
                      >
                        {/* Sender Name inside bubble */}
                        {m.senderName && !isMe && (
                          <span className={`text-[10px] font-normal mb-1 select-none ${getSenderNameColor(m.senderName)}`}>
                            {m.senderName}
                          </span>
                        )}

                        <p className={`whitespace-pre-line ${containsTibetan(m.text) ? 'font-tibetan' : ''}`}>{m.text}</p>

                        {/* Time & status indicator inside bubble */}
                        <div className={`flex items-center justify-end gap-1 m text-[8px] select-none ${isMe ? 'text-white/70' : 'text-muted-foreground/40'}`}>
                          <span>{m.time}</span>
                          {isMe && <CheckCheck className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Partner Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2.5 w-full flex-row animate-pulse">
                {/* Partner Avatar */}
                <Avatar className="h-8 w-8 border border-muted-foreground/10 shrink-0 rounded-full">
                  {activeChat.avatar ? (
                    <AvatarImage src={activeChat.avatar} alt={activeChat.name} className="object-cover rounded-full" />
                  ) : null}
                  <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold rounded-full">
                    {activeChat.initials || activeChat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start">
                  <div className="bg-muted text-foreground py-2.5 px-4 rounded-2xl rounded-bl-none text-xs flex flex-col gap-1">
                    <span className={`text-[11px] font-bold select-none ${getSenderNameColor(activeChat.name)}`}>
                      {activeChat.name}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[10px] italic">{lang === 'en' ? 'Thinking...' : 'བསམ་བློ་གཏོང་བཞིན་པ།...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="p-3 border-t bg-card flex items-center gap-1.5">
          <button className="p-1.5 text-muted-foreground hover:text-brand hover:bg-muted rounded-full transition" title={lang === 'en' ? "Attach assets" : "ཡིག་ཆ་སྦྲག་རྒྱུ།"}>
            <Plus className="h-5 w-5" />
          </button>

          <div className="flex-1 bg-muted/60 dark:bg-muted/30 rounded-xl px-3 py-1.5 flex items-center justify-between border border-transparent focus-within:border-brand/40 transition duration-150">
            <input
              type="text"
              placeholder={translations[lang].typeMessage}
              value={msgText}
              onChange={(e) => onMsgTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent text-xs outline-none p-0.5 max-h-12 border-none focus:ring-0 text-foreground ${containsTibetan(msgText) ? 'font-tibetan' : ''}`}
            />
            <button className="text-muted-foreground hover:text-foreground transition p-0.5" title={lang === 'en' ? "Add emoji" : "མཚོན་རྟགས་སྦྲག་རྒྱུ།"}>
              <Smile className="h-4.5 w-4.5" />
            </button>
          </div>

          <button
            onClick={onSendMessage}
            disabled={!msgText.trim()}
            className={`p-2 rounded-full shrink-0 transition shadow-sm active:scale-95 ${msgText.trim()
              ? 'bg-brand hover:bg-brand-hover text-brand-foreground'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            title={lang === 'en' ? "Send message" : "ཡིག་འཕྲིན་གཏོང་རྒྱུ།"}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Room Details Side Panel */}
      {showRoomDetails && (
        <div className="absolute inset-y-0 right-0 w-full md:w-80 md:relative bg-card border-l border-muted/20 flex flex-col h-full shrink-0 z-30 shadow-xl md:shadow-none animate-in slide-in-from-right duration-200">

          {/* Panel Header */}
          <div className="px-4 py-3.5 border-b flex items-center justify-between font-bold text-sm tracking-tight bg-card">
            <h4 className="font-bold text-sm">{lang === 'en' ? 'Room Details' : 'གླེང་མོལ་ཁང་གི་གནས་ཚུལ།'}</h4>
            <button
              onClick={() => setShowRoomDetails(false)}
              className="p-1 hover:bg-muted rounded-full transition"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Panel Body */}
          <ScrollArea className="flex-1 bg-muted/5">
            {isEditingDetails ? (
              <div className="w-full space-y-4 px-4 py-4 border-b border-muted/20 pb-5 bg-card">
                {/* Edit Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    <Avatar className="h-16 w-16 border-2 border-dashed border-brand/40 hover:border-brand transition rounded-2xl flex items-center justify-center bg-card">
                      <AvatarImage src={editAvatarPreview || activeChat.avatar} className="object-cover rounded-2xl" />
                      <AvatarFallback className="bg-brand-light text-brand text-xs font-bold rounded-2xl flex items-center justify-center">
                        <Image className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute inset-0 bg-black/45 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 text-[8px] font-bold text-center p-1 select-none cursor-pointer">
                      {lang === 'en' ? 'Upload Photo' : 'པར་တင်རྒྱུ།'}
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Edit Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{lang === 'en' ? 'Room Name' : 'གླེང་མོལ་ཁང་གི་མིང་།'}</label>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xs h-8 bg-card"
                    placeholder={lang === 'en' ? 'Room name' : 'གླེང་མོལ་ཁང་གི་མིང་།'}
                  />
                </div>

                {/* Edit Topic */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{lang === 'en' ? 'Room Description' : 'གླེང་མོལ་ཁང་གི་བཤད་པ།'}</label>
                  <textarea
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="w-full text-xs p-2 bg-card border border-muted-foreground/15 rounded-md focus:ring-1 focus:ring-brand outline-none text-foreground resize-none h-16"
                    placeholder={lang === 'en' ? 'Room description...' : 'གླེང་མོལ་ཁང་གི་བཤད་པ།...'}
                  />
                </div>

                {/* Save/Cancel buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRoomDetails}
                    disabled={isSavingDetails || !editName.trim()}
                    className="flex-1 py-1.5 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingDetails ? (lang === 'en' ? 'Saving...' : 'ཉར་བཞིན་པ།...') : (lang === 'en' ? 'Save' : 'ཉར་ཚགས།')}
                  </button>
                  <button
                    onClick={() => setIsEditingDetails(false)}
                    disabled={isSavingDetails}
                    className="flex-1 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-muted rounded-lg text-[10px] font-bold transition active:scale-95 cursor-pointer"
                  >
                    {lang === 'en' ? 'Cancel' : 'ཕྱིར་འཐེན།'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center border-b border-muted/20 pb-5">
                <div className="relative mb-3.5">
                  <Avatar className={`h-16 w-16 border-2 border-brand/20 shadow-xs transition-all ${activeChat.isGroup ? 'rounded-2xl' : 'rounded-full'
                    }`}>
                    <AvatarImage
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className={`object-cover ${activeChat.isGroup ? 'rounded-2xl' : 'rounded-full'}`}
                    />
                    <AvatarFallback className={`text-base font-bold transition-all ${activeChat.isGroup
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100 rounded-2xl'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 rounded-full'
                      }`}>
                      {activeChat.initials || activeChat.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!activeChat.isGroup && (
                    <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-card ${activeChat.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                      }`} />
                  )}
                </div>

                <h3 className="font-bold text-sm text-foreground text-center truncate w-full px-2">
                  {activeChat.name}
                </h3>

                <span className="text-[10px] text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-md font-mono select-all">
                  {activeChat.isGroup ? (lang === 'en' ? 'Group Chat' : 'ཚོགས་པའི་གླེང་མོལ།') : (lang === 'en' ? 'Direct Conversation' : 'སྒེར་གྱི་སྐད་ཆ།')}
                </span>

                {activeChat.topic ? (
                  <div className="text-[11px] text-muted-foreground text-center px-4 mt-3 leading-relaxed break-words border-t border-muted/20 pt-3 w-full">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1">{lang === 'en' ? 'Room Topic' : 'གླེང་མོལ་ཁང་གི་བརྗོད་གཞི།'}</span>
                    <p className="text-foreground/90">{activeChat.topic}</p>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground/60 italic text-center mt-3 border-t border-muted/20 pt-3 w-full">
                    {lang === 'en' ? 'No topic description set for this room.' : 'གླེང་མོལ་ཁང་འདིར་བརྗོད་གཞི་བཀོད་མི་འདུག'}
                  </div>
                )}

                {activeChat.isGroup && activeChat.isAdmin && onUpdateRoomDetails && (
                  <button
                    onClick={() => {
                      setEditName(activeChat.name);
                      setEditTopic(activeChat.topic || '');
                      setEditAvatarFile(null);
                      setEditAvatarPreview(null);
                      setIsEditingDetails(true);
                    }}
                    className="mt-3.5 px-3 py-1.5 border border-muted bg-card hover:bg-muted text-xs font-bold rounded-lg flex items-center gap-1.5 transition active:scale-95 text-brand cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    {lang === 'en' ? 'Edit Details' : 'གནས་ཚུལ་བཟོ་བཅོས།'}
                  </button>
                )}

                {/* Room ID section */}
                <div className="w-full mt-4 border-t border-muted/20 pt-3">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1 px-1">{lang === 'en' ? 'Room Coordinate ID' : 'གླེང་མོལ་ཁང་གི་ཨང་རྟགས།'}</span>
                  <div className="bg-muted/45 border border-muted p-2 rounded-xl text-[9px] font-mono break-all flex items-center justify-between gap-1.5 shadow-2xs">
                    <span className="truncate flex-1 select-all">{activeChat.id}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(activeChat.id)}
                      className="p-1 hover:bg-muted text-brand hover:text-brand-hover rounded-md transition shrink-0"
                      title={lang === 'en' ? "Copy ID" : "ཨང་རྟགས་འདྲ་བཟོ།"}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invite Section */}
            {activeChat.isGroup && activeChat.isAdmin && onInviteUser && (
              <div className="px-4 py-3 border-b border-muted/20">
                <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground block mb-2">
                  {lang === 'en' ? 'Invite New Member' : 'ཚོགས་མི་གསར་པ་གདན་འདྲེན།'}
                </span>
                <form onSubmit={handleInviteUserAction} className="flex gap-1.5">
                  <Input
                    type="text"
                    value={inviteId}
                    onChange={(e) => setInviteId(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. username or @user:domain' : 'སྤྱོད་མིང་འཇུག་རོགས།'}
                    className="text-xs h-8 bg-card flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isInviting || !inviteId.trim()}
                    className="px-3 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg text-xs font-bold transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
                    title={lang === 'en' ? 'Invite' : 'གདན་འདྲེན་ཞུ།'}
                  >
                    {isInviting ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Member List section */}
            <div className="py-4">
              <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-4 mb-2 block">
                {lang === 'en' ? `Team Members (${activeChat.members?.length || 0})` : `ཚོགས་མི། (${activeChat.members?.length || 0})`}
              </span>

              <div className="divide-y divide-muted/10 ">
                {activeChat.members && activeChat.members.length > 0 ? (
                  activeChat.members.map((member) => (
                    <div
                      key={member.id}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/20 transition duration-150"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 ">
                        <div className="relative shrink-0">
                          <Avatar className="h-7 w-7 border border-muted-foreground/10">
                            <AvatarImage src={member.avatar} alt={member.name} className="object-cover animate-fade-in" />
                            <AvatarFallback className="bg-brand-light text-brand-light-foreground text-[10px] font-bold">
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-1 ring-card ${member.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                            }`} />
                        </div>

                        <div className="min-w-0 leading-tight">
                          <span className="text-xs font-semibold text-foreground truncate block">
                            {member.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground truncate block font-mono">
                            {member.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {member.role && (
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                            member.role === 'Me' || member.role === 'Admin' || member.role === 'Admin (Me)'
                              ? 'bg-brand-light text-brand-light-foreground'
                              : member.role === 'Moderator'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
                              : 'bg-muted text-muted-foreground'
                            }`}>
                            {member.role === 'Me'
                              ? (lang === 'en' ? 'Me' : 'བདག་ཉིད།')
                              : member.role === 'Admin'
                              ? (lang === 'en' ? 'Admin' : 'དོ་དམ་པ།')
                              : member.role === 'Admin (Me)'
                              ? (lang === 'en' ? 'Admin (Me)' : 'དོ་དམ་པ། (བདག་ཉིད།)')
                              : member.role === 'Moderator'
                              ? (lang === 'en' ? 'Moderator' : 'བར་འདུམ་པ།')
                              : member.role}
                          </span>
                        )}

                        {activeChat.isGroup && activeChat.isAdmin && member.id !== activeChat.members?.[0]?.id && member.role !== 'Me' && member.role !== 'Admin (Me)' && onRemoveUser && (
                          <button
                            onClick={() => handleRemoveUserAction(member.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-md transition shrink-0 cursor-pointer"
                            title={lang === 'en' ? `Remove ${member.name}` : `ཕྱིར་འབུད་བྱེད་རྒྱུ།`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground italic">
                    {lang === 'en' ? 'No members roster loaded.' : 'ཚོགས་མིའི་ཐོ་གཞུང་འཐེན་མི་འདུག'}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Danger Zone / Room Actions */}
          {activeChat.isGroup && onLeaveRoom && (
            <div className="p-4 border-t border-muted/20 bg-card shrink-0">
              <button
                onClick={handleLeaveRoomAction}
                className="w-full py-2 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {activeChat.isAdmin ? (
                  lang === 'en' ? 'Destroy Room (Leave)' : 'གླེང་མོལ་ཁང་མེད་པར་བཟོ་བ།'
                ) : (
                  lang === 'en' ? 'Leave Room' : 'གླེང་མོལ་ཁང་ནས་ཐོན་པ།'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
