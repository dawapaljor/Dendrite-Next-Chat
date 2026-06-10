'use client';

import React from 'react';
import { Search, Hash, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatThread } from "./types";
import { translations, Language } from "@/lib/translations";

interface SidebarThreadsProps {
  threads: ChatThread[];
  activeId: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectThread: (id: string) => void;
  onNewGroupClick?: () => void;
  lang: Language;
}

export default function SidebarThreads({
  threads,
  activeId,
  searchQuery,
  onSearchChange,
  onSelectThread,
  onNewGroupClick,
  lang
}: SidebarThreadsProps) {
  const filteredThreads = threads.filter(thread =>
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Search Input using shadcn Input */}
      <div className="px-4 py-3 flex gap-2 items-center border-b">
        <div className="relative flex-1">
          <Input
            id="sidebar-chat-search"
            type="text"
            placeholder={translations[lang].searchConversations}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/50 border-input"
          />
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {onNewGroupClick && (
          <button
            onClick={onNewGroupClick}
            className="p-2 text-brand rounded-lg hover:bg-brand-light hover:text-brand-light-foreground transition active:scale-95 text-xs font-semibold flex items-center justify-center shrink-0 h-9"
            title={translations[lang].createGroupTooltip}
          >
            {/* Pen Square svg */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-4 py-4 bg-muted/20 text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
        {translations[lang].recentActivity}
      </div>

      {/* Threads List with custom scroll area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col">
          {filteredThreads.map((thread) => {
            const isActive = activeId === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`flex items-center gap-3 px-4 py-2 transition cursor-pointer select-none border-b border-border/10 dark:border-border/5 last:border-b-0 ${isActive
                  ? 'bg-brand-light/60 dark:bg-muted/50'
                  : 'hover:bg-muted/20'
                  }`}
              >
                {/* Avatar with dynamic fallback */}
                <div className="relative shrink-0">
                  <Avatar className={`h-12 w-12 border border-muted-foreground/10 transition-all ${thread.isGroup ? 'rounded-xl' : 'rounded-full'
                    }`}>
                    <AvatarImage
                      src={thread.avatar}
                      alt={thread.name}
                      className={`object-cover ${thread.isGroup ? 'rounded-xl' : 'rounded-full'}`}
                    />
                    <AvatarFallback className={`text-sm font-bold font-mono transition-all ${thread.isGroup
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 rounded-xl'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 rounded-full'
                      }`}>
                      {thread.initials || thread.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Status Indicator Badge (Only for DMs) */}
                  {!thread.isGroup && (
                    <>
                      {thread.online === true && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                      )}
                      {thread.online === 'typing' && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-brand ring-2 ring-card animate-pulse" />
                      )}
                      {thread.online === 'offline' && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-muted-foreground/30 ring-2 ring-card" />
                      )}
                    </>
                  )}
                </div>

                {/* Subject & snippet message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-semibold text-xs truncate text-foreground flex items-center gap-1">
                      {thread.isGroup ? (
                        <Hash className="h-3.5 w-3.5 text-indigo-500/80 shrink-0" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-emerald-500/75 shrink-0" />
                      )}
                      <span className="truncate">{thread.name}</span>
                    </h4>
                    <span className="text-[9px] text-muted-foreground shrink-0">{thread.time}</span>
                  </div>
                  <p className={`text-[11px] truncate pr-4 ${thread.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {thread.lastMessage}
                  </p>
                </div>

                {/* Unread Pill */}
                {thread.unreadCount > 0 && (
                  <Badge variant="default" className="h-5 min-w-5 px-1 bg-brand hover:bg-brand text-brand-foreground text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {thread.unreadCount}
                  </Badge>
                )}
              </div>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">{translations[lang].noConversations}</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
