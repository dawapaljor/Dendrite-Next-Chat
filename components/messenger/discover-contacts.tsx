'use client';

import React from 'react';
import { Search, Compass, MessageSquare, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Contact, ChatThread } from "./types";
import { translations, Language } from "@/lib/translations";

interface DiscoverContactsProps {
  contacts: Contact[];
  chats: ChatThread[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onConnectChat: (contactId: string) => void;
  onConnectRoom: (roomId: string) => void;
  lang: Language;
}

export default function DiscoverContacts({
  contacts,
  chats,
  searchQuery,
  onSearchChange,
  onConnectChat,
  onConnectRoom,
  lang
}: DiscoverContactsProps) {
  const [activeTab, setActiveTab] = React.useState<'one-to-one' | 'rooms'>('one-to-one');
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  // Swipe gesture touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe left (diff > 50) -> rooms tab
    if (diff > 50 && activeTab === 'one-to-one') {
      setActiveTab('rooms');
    }
    // Swipe right (diff < -50) -> one-to-one tab
    if (diff < -50 && activeTab === 'rooms') {
      setActiveTab('one-to-one');
    }
    setTouchStart(null);
  };

  // Filter contacts by query
  const filteredContacts = contacts.filter(co =>
    co.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    co.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    co.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suggested contacts
  const suggestedContacts = contacts.filter(c => c.suggested === true);

  // Filter group rooms from chats
  const groupRooms = chats.filter(c => c.isGroup === true);
  const filteredRooms = groupRooms.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.topic && r.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const t = translations[lang];

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* View Title Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <div className="p-1.5 rounded-md">
          <Compass className="h-6 w-6 text-brand" />
        </div>
        <h3 className="font-bold text-sm tracking-tight">{t.discoverColleagues}</h3>
      </div>

      {/* Sliding Tab Switcher */}
      <div className="px-4 pt-2.5 pb-0.5 border-b flex items-center bg-card">
        <div className="relative flex p-1 bg-muted/50 dark:bg-muted/30 rounded-xl w-full select-none border border-border/5">
          {/* Active Sliding Pill Indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand rounded-lg shadow-md transition-all duration-300 ease-out ${
              activeTab === 'one-to-one' ? 'left-1' : 'left-[50%]'
            }`}
          />
          <button
            onClick={() => setActiveTab('one-to-one')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg relative z-10 transition-colors duration-200 cursor-pointer ${
              activeTab === 'one-to-one' ? 'text-brand-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.oneToOne}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg relative z-10 transition-colors duration-200 cursor-pointer ${
              activeTab === 'rooms' ? 'text-brand-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.rooms}
          </button>
        </div>
      </div>

      {/* Discover Search bar */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Input
            id="discover-search"
            type="text"
            placeholder={
              activeTab === 'one-to-one'
                ? t.searchColleagues
                : (lang === 'en' ? 'Search group rooms...' : 'ཚགས་པའི་གླེང་མོལ་ཁང་འཚོལ་བ།...')
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/60"
          />
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Sliding/Swipable Content Viewports */}
      <div className="flex-1 w-full overflow-hidden relative">
        <div
          className="flex h-full w-[200%] transition-transform duration-300 ease-out"
          style={{ transform: activeTab === 'one-to-one' ? 'translateX(0%)' : 'translateX(-50%)' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pane 1: One-to-One / Contacts List */}
          <ScrollArea className="w-[50%] h-full bg-muted/10">
            <div className="pb-6">
              {/* SUGGESTED CAROUSEL */}
              {suggestedContacts.length > 0 && !searchQuery && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="px-4 py-4 bg-transparent text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      {t.suggestedContacts}
                    </span>
                    <span className="text-[10px] text-brand font-semibold flex items-center gap-0.5 select-none cursor-pointer pr-4">
                      {t.seeAll} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>

                  <ScrollArea className="w-full pb-2">
                    <div className="flex gap-3 pr-4 pl-4">
                      {suggestedContacts.map((col) => (
                        <Card
                          key={col.id}
                          className="w-[180px] shrink-0 border border-muted bg-card shadow-xs rounded-xl overflow-hidden hover:shadow transition duration-200"
                        >
                          <CardContent className="p-3.5 flex flex-col items-center text-center">
                            <div className="relative mb-2">
                              <Avatar className="h-12 w-12 border-2 border-brand/20">
                                <AvatarImage src={col.avatar} alt={col.name} className="object-cover" />
                                <AvatarFallback className="bg-brand-light text-brand-light-foreground text-xs font-bold">
                                  {col.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {col.online === true && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                              )}
                            </div>

                            <h4 className="font-bold text-xs text-foreground truncate w-full">{col.name}</h4>
                            <p className="text-[10px] text-muted-foreground truncate w-full mb-2">{col.role}</p>

                            <div className="flex flex-wrap justify-center gap-1 mb-3.5 h-[16px] overflow-hidden">
                              {col.skills?.slice(0, 2).map((sk, sidx) => (
                                <span key={sidx} className="text-[8px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                                  {sk}
                                </span>
                              )) || (
                                  <span className="text-[8px] text-slate-400 font-mono">Expert Dev</span>
                                )}
                            </div>

                            <button
                              onClick={() => onConnectChat(col.id)}
                              className="w-full py-1 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-97 cursor-pointer"
                            >
                              <MessageSquare className="h-3 w-3" />
                              {t.sendChat}
                            </button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-1.5" />
                  </ScrollArea>
                </div>
              )}

              {/* MASTER ROSTER LISTING */}
              <div className="space-y-2 pt-4">
                <span className="px-4 py-4 text-[10px] tracking-wider uppercase font-bold text-muted-foreground block">
                  {t.teamContactsListing} ({filteredContacts.length})
                </span>

                <div className="space-y-1.5">
                  {filteredContacts.map((co) => (
                    <div
                      key={co.id}
                      className="gap-3 px-4 py-3.5 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-800 hover:bg-muted/50 transition duration-150 border-b border-border/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="h-12 w-12 border border-muted-foreground/10 transition-all rounded-full">
                            <AvatarImage src={co.avatar} alt={co.name} className="object-cover animate-fade-in rounded-full" />
                            <AvatarFallback className="bg-[#e4ebff] text-slate-800 text-sm font-bold rounded-full">
                              {co.initials || co.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {co.online === true && (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                          )}
                        </div>

                        <div className="leading-tight">
                          <h4 className="font-bold text-xs text-foreground">{co.name}</h4>
                          <p className="text-[10px] text-muted-foreground break-all">{co.id}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onConnectChat(co.id)}
                        className="p-2 bg-muted hover:bg-[#e8ecef] dark:hover:bg-muted/80 text-foreground hover:text-brand rounded-lg transition active:scale-95 cursor-pointer"
                        title={`Start dialogue with ${co.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {filteredContacts.length === 0 && (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      {t.noContactsFound}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Pane 2: Rooms / Groups List */}
          <ScrollArea className="w-[50%] h-full bg-muted/10">
            <div className="pb-6">
              <div className="space-y-2 pt-4">
                <span className="px-4 py-4 text-[10px] tracking-wider uppercase font-bold text-muted-foreground block">
                  {lang === 'en' ? 'Group Rooms' : 'ཚགས་པའི་གླེང་མོལ་ཁང་།'} ({filteredRooms.length})
                </span>

                <div className="space-y-1.5">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="gap-3 px-4 py-3.5 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-800 hover:bg-muted/50 transition duration-150 border-b border-border/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="h-12 w-12 border border-muted-foreground/10 transition-all rounded-full">
                            <AvatarImage src={room.avatar} alt={room.name} className="object-cover animate-fade-in rounded-full" />
                            <AvatarFallback className="bg-brand-light text-brand-light-foreground text-sm font-bold rounded-full">
                              {room.initials || room.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="leading-tight">
                          <h4 className="font-bold text-xs text-foreground">{room.name}</h4>
                          {room.topic ? (
                            <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px] md:max-w-[300px]">{room.topic}</p>
                          ) : (
                            <p className="text-[10px] text-muted-foreground/60 italic">
                              {lang === 'en' ? 'No topic set' : 'བརྗོད་གཞི་མི་འདུག'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {room.members && room.members.length > 0 && (
                          <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                            {room.members.length} {lang === 'en' ? 'members' : 'ཚོགས་མི།'}
                          </span>
                        )}
                        <button
                          onClick={() => onConnectRoom(room.id)}
                          className="p-2 bg-muted hover:bg-[#e8ecef] dark:hover:bg-muted/80 text-foreground hover:text-brand rounded-lg transition active:scale-95 cursor-pointer"
                          title={`Open ${room.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredRooms.length === 0 && (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      {lang === 'en' ? 'No group rooms found.' : 'ཚགས་པའི་གླེང་མོལ་ཁང་མ་རྙེད།'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
