'use client';

import React from 'react';
import { Search, Compass, MessageSquare, Award, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contact } from "./types";

interface DiscoverContactsProps {
  contacts: Contact[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onConnectChat: (contactId: string) => void;
}

export default function DiscoverContacts({
  contacts,
  searchQuery,
  onSearchChange,
  onConnectChat
}: DiscoverContactsProps) {

  // Filter contacts by query
  const filtered = contacts.filter(co =>
    co.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    co.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suggested contacts
  const suggestedContacts = contacts.filter(c => c.suggested === true);

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* View Title Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <div className="p-1 px-1.5 bg-blue-100 text-[#0076FF] dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
          <Compass className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-sm tracking-tight">Discover Team Members</h3>
      </div>

      {/* Discover Search bar using shadcn Input */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Input
            id="discover-search"
            type="text"
            placeholder="Search role, skills, or colleague..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/60"
          />
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Scrollable Container */}
      <ScrollArea className="flex-1 w-full bg-muted/10">
        <div className="py-4 px-4 space-y-5">

          {/* SEC 1: SUGGESTED CAROUSEL */}
          {suggestedContacts.length > 0 && !searchQuery && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                  Highly Interactive Matches
                </span>
                <span className="text-[10px] text-blue-500 font-semibold flex items-center gap-0.5 select-none cursor-pointer">
                  See all <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              <ScrollArea className="w-full pb-2">
                <div className="flex gap-3 pr-4">
                  {suggestedContacts.map((col) => (
                    <Card
                      key={col.id}
                      className="w-[180px] shrink-0 border border-muted bg-card shadow-xs rounded-xl overflow-hidden hover:shadow transition duration-200"
                    >
                      <CardContent className="p-3.5 flex flex-col items-center text-center">
                        <div className="relative mb-2">
                          <Avatar className="h-12 w-12 border-2 border-[#dde1ff]">
                            <AvatarImage src={col.avatar} alt={col.name} className="object-cover" />
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-bold">
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
                          className="w-full py-1 bg-[#0076FF] hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-97"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Send Chat
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-1.5" />
              </ScrollArea>
            </div>
          )}

          {/* SEC 2: MASTER ROSTER LISTING */}
          <div className="space-y-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground px-1 block">
              Team Contacts Listing ({filtered.length})
            </span>

            <div className="space-y-1.5">
              {filtered.map((co) => (
                <div
                  key={co.id}
                  className=" p-2.5 px-3 rounded-xl flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-800 hover:bg-muted/50 transition duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={co.avatar} alt={co.name} className="object-cover animate-fade-in" />
                        <AvatarFallback className="bg-[#e4ebff] text-slate-800 text-xs font-bold">
                          {co.initials || co.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {co.online === true && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                      )}
                    </div>

                    <div className="leading-tight">
                      <h4 className="font-bold text-xs text-foreground">{co.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{co.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onConnectChat(co.id)}
                    className="p-2 bg-muted hover:bg-[#e8ecef] dark:hover:bg-muted/80 text-foreground hover:text-blue-600 rounded-lg transition active:scale-95"
                    title={`Start dialogue with ${co.name}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No directory records found matching your query.
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
