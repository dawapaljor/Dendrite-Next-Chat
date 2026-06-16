'use client';

import React from 'react';
import { Search, Hash, Check, ArrowLeft } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "./types";
import { translations, Language } from "@/lib/translations";

interface NewGroupViewProps {
  contacts: Contact[];
  groupName: string;
  onGroupNameChange: (val: string) => void;
  groupSearch: string;
  onGroupSearchChange: (val: string) => void;
  selectedGroupContacts: string[];
  onToggleContact: (id: string) => void;
  onClose: () => void;
  onConfirm: (enableE2EE: boolean) => void;
  lang: Language;
}

export default function NewGroupView({
  contacts,
  groupName,
  onGroupNameChange,
  groupSearch,
  onGroupSearchChange,
  selectedGroupContacts,
  onToggleContact,
  onClose,
  onConfirm,
  lang
}: NewGroupViewProps) {
  const [enableE2EE, setEnableE2EE] = React.useState(false);
  
  // Filter contacts by keyword
  const filtered = contacts.filter(co =>
    co.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
    co.role.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
          <ArrowLeft className="h-4.5 w-4.5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 bg-brand-light text-brand rounded">
            <Hash className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm truncate">{translations[lang].createSquadChannel}</h3>
        </div>
      </div>
 
      <div className="p-4 space-y-4 flex-1 flex flex-col min-h-0 bg-muted/5">
        {/* Name input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">
            {translations[lang].squadName}
          </label>
          <Input
            type="text"
            required
            placeholder={translations[lang].enterSquadName}
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
            className="text-xs h-9 bg-card"
          />
        </div>

        {/* Search contacts for checklist */}
        <div className="space-y-1.5 flex-1 flex flex-col min-h-0 min-w-0">
          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">
            {translations[lang].selectContacts} ({selectedGroupContacts.length})
          </label>
          
          <div className="relative">
            <Input
              type="text"
              placeholder={translations[lang].searchContactsToInvite}
              value={groupSearch}
              onChange={(e) => onGroupSearchChange(e.target.value)}
              className="pl-8 text-xs h-9 bg-card"
            />
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <ScrollArea className="flex-1 mt-2 border rounded-xl bg-card">
            <div className="p-2 space-y-1">
              {filtered.map((co) => {
                const isChecked = selectedGroupContacts.includes(co.id);
                return (
                  <div
                    key={co.id}
                    onClick={() => onToggleContact(co.id)}
                    className="flex items-center justify-between p-2.5 hover:bg-muted/40 rounded-lg cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={co.avatar} alt={co.name} className="object-cover" />
                        <AvatarFallback className="bg-brand-light text-brand-light-foreground text-xs font-bold">
                          {co.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight min-w-0">
                        <h5 className="text-xs font-semibold text-foreground truncate">{co.name}</h5>
                        <p className="text-[10px] text-muted-foreground truncate">{co.role}</p>
                      </div>
                    </div>

                    {/* Checkbox indicator */}
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${
                      isChecked 
                        ? 'bg-brand border-brand text-brand-foreground' 
                        : 'border-muted-foreground/30 bg-card'
                    }`}>
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  {translations[lang].noContactsFound}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
 
        {/* E2EE Toggle Switch */}
        <div className="flex items-center justify-between p-3 bg-card border border-muted rounded-xl select-none">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${enableE2EE ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/></svg>
            </span>
            <div className="leading-tight">
              <span className="text-xs font-semibold block">{translations[lang].enableEncryption}</span>
              <span className="text-[10px] text-muted-foreground">megolm.v1.aes-sha2</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enableE2EE}
            onClick={() => setEnableE2EE(!enableE2EE)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              enableE2EE ? 'bg-brand' : 'bg-muted-foreground/30'
            }`}
          >
            <span
              className={`pointer-events-none block h-4.5 w-4.5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                enableE2EE ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={() => onConfirm(enableE2EE)}
          disabled={selectedGroupContacts.length === 0}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition active:scale-[0.98] ${
            selectedGroupContacts.length > 0
              ? 'bg-brand text-brand-foreground hover:bg-brand-hover shadow'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {translations[lang].createChannel}
        </button>
      </div>
    </div>
  );
}
