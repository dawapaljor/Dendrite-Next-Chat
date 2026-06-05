'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Phone, 
  Video, 
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
  Hash
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatThread } from "./types";

interface ChatViewProps {
  activeChat: ChatThread;
  msgText: string;
  onMsgTextChange: (val: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  onBackClick?: () => void; // only needed on mobile layout
}

export default function ChatView({
  activeChat,
  msgText,
  onMsgTextChange,
  onSendMessage,
  isTyping,
  onBackClick
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRoomDetails, setShowRoomDetails] = useState<boolean>(false);

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
              <Avatar className={`h-9 w-9 border border-muted-foreground/10 transition-all ${
                activeChat.isGroup ? 'rounded-xl' : 'rounded-full'
              }`}>
                <AvatarImage 
                  src={activeChat.avatar} 
                  alt={activeChat.name} 
                  className={`object-cover ${activeChat.isGroup ? 'rounded-xl' : 'rounded-full'}`} 
                />
                <AvatarFallback className={`text-xs font-bold transition-all ${
                  activeChat.isGroup 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100 rounded-xl' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 rounded-full'
                }`}>
                  {activeChat.initials || activeChat.name.substring(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!activeChat.isGroup && (
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card ${
                  activeChat.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
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
                  ? `${activeChat.members?.length || 0} members` 
                  : (isTyping ? 'typing...' : activeChat.online === true ? 'Online' : 'Offline')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              className={`p-1.5 hover:bg-muted rounded-full transition ${showRoomDetails ? 'text-[#0076FF] bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground'}`}
              title="Room details & members"
            >
              <Users className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full text-muted-foreground" title="Start voice call">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full text-muted-foreground" title="Start video call">
              <Video className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full text-muted-foreground" title="More options">
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
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}>
                  {!isMe && activeChat.isGroup && m.senderName && (
                    <span className="text-[10px] text-muted-foreground ml-2 mb-0.5">{m.senderName}</span>
                  )}

                  {m.isImage ? (
                    <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md border hover:border-blue-500/40 transition duration-300 border-muted">
                      <div className="bg-[#0f172a] p-3 text-white">
                        <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-800">
                          <span className="font-mono text-[9px] text-blue-400 flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            DASHBOARD_LIVE_METRICS
                          </span>
                          <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-bold">SYSTEM</span>
                        </div>
                        
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-indigo-500/20">
                          <div className="flex gap-1.5 mb-2.5">
                            <div className="flex-1 h-3.5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
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
                              <div className="w-1.5 h-[34px] bg-[#0076FF] rounded-lg"></div>
                            </div>
                          </div>
                          <span className="block text-[8px] text-slate-500 font-mono text-center">AUTO_PERSIST=OK • PORT=3000</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-2 text-[10px] text-muted-foreground flex justify-between items-center">
                        <span className="truncate max-w-[170px]">Dashboard_Mock_Layout.png</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">(1.4 MB)</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs transition duration-200 ${
                        isMe
                          ? 'bg-[#0076FF] text-white rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  )}

                  {/* status/timestamp */}
                  <div className="flex items-center gap-1.5 mt-1 px-1 select-none">
                    <span className="text-[8px] text-muted-foreground">{m.time}</span>
                    {isMe && (
                      <span className="text-[#0076FF]">
                        <CheckCheck className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Partner Typing indicator */}
            {isTyping && (
              <div className="flex flex-col items-start gap-1">
                <div className="bg-muted text-muted-foreground py-2 px-3.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-2">
                  <div className="flex gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-[10px]" style={{ fontStyle: 'italic' }}>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="p-3 border-t bg-card flex items-center gap-1.5">
          <button className="p-1.5 text-muted-foreground hover:text-[#0076FF] hover:bg-muted rounded-full transition" title="Attach assets">
            <Plus className="h-5 w-5" />
          </button>
          
          <div className="flex-1 bg-muted/60 dark:bg-muted/30 rounded-xl px-3 py-1.5 flex items-center justify-between border border-transparent focus-within:border-[#0076FF]/40 transition duration-150">
            <input
              type="text"
              placeholder="Type a message or press enter..."
              value={msgText}
              onChange={(e) => onMsgTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-xs outline-none p-0.5 max-h-12 border-none focus:ring-0 text-foreground"
            />
            <button className="text-muted-foreground hover:text-foreground transition p-0.5" title="Add emoji">
              <Smile className="h-4.5 w-4.5" />
            </button>
          </div>

          <button
            onClick={onSendMessage}
            disabled={!msgText.trim()}
            className={`p-2 rounded-full shrink-0 transition shadow-sm active:scale-95 ${
              msgText.trim() 
                ? 'bg-[#0076FF] hover:bg-blue-600 text-white' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            title="Send message"
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
            <h4 className="font-bold text-sm">Room Details</h4>
            <button 
              onClick={() => setShowRoomDetails(false)} 
              className="p-1 hover:bg-muted rounded-full transition"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Panel Body */}
          <ScrollArea className="flex-1 bg-muted/5">
            <div className="p-4 flex flex-col items-center border-b border-muted/20 pb-5">
              <div className="relative mb-3.5">
                <Avatar className={`h-16 w-16 border-2 border-[#0076FF]/20 shadow-xs transition-all ${
                  activeChat.isGroup ? 'rounded-2xl' : 'rounded-full'
                }`}>
                  <AvatarImage 
                    src={activeChat.avatar} 
                    alt={activeChat.name} 
                    className={`object-cover ${activeChat.isGroup ? 'rounded-2xl' : 'rounded-full'}`} 
                  />
                  <AvatarFallback className={`text-base font-bold transition-all ${
                    activeChat.isGroup 
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100 rounded-2xl' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 rounded-full'
                  }`}>
                    {activeChat.initials || activeChat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!activeChat.isGroup && (
                  <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-card ${
                    activeChat.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>

              <h3 className="font-bold text-sm text-foreground text-center truncate w-full px-2">
                {activeChat.name}
              </h3>
              
              <span className="text-[10px] text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-md font-mono select-all">
                {activeChat.isGroup ? 'Group Chat' : 'Direct Conversation'}
              </span>

              {activeChat.topic ? (
                <div className="text-[11px] text-muted-foreground text-center px-4 mt-3 leading-relaxed break-words border-t border-muted/20 pt-3 w-full">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1">Room Topic</span>
                  <p className="text-foreground/90">{activeChat.topic}</p>
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground/60 italic text-center mt-3 border-t border-muted/20 pt-3 w-full">
                  No topic description set for this room.
                </div>
              )}

              {/* Room ID section */}
              <div className="w-full mt-4 border-t border-muted/20 pt-3">
                <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1 px-1">Room Coordinate ID</span>
                <div className="bg-muted/45 border border-muted p-2 rounded-xl text-[9px] font-mono break-all flex items-center justify-between gap-1.5 shadow-2xs">
                  <span className="truncate flex-1 select-all">{activeChat.id}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(activeChat.id)} 
                    className="p-1 hover:bg-muted text-[#0076FF] hover:text-blue-600 rounded-md transition shrink-0" 
                    title="Copy ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Member List section */}
            <div className="py-4">
              <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-4 mb-2 block">
                Team Members ({activeChat.members?.length || 0})
              </span>

              <div className="divide-y divide-muted/10">
                {activeChat.members && activeChat.members.length > 0 ? (
                  activeChat.members.map((member) => (
                    <div 
                      key={member.id} 
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/20 transition duration-150"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <Avatar className="h-7 w-7 border border-muted-foreground/10">
                            <AvatarImage src={member.avatar} alt={member.name} className="object-cover animate-fade-in" />
                            <AvatarFallback className="bg-blue-50 text-blue-900 text-[10px] font-bold">
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-1 ring-card ${
                            member.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'
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

                      {member.role && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                          member.role === 'Me' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {member.role}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground italic">
                    No members roster loaded.
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
