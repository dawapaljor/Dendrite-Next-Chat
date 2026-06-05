'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Compass, 
  User, 
  Laptop,
  Users,
  Bell,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SidebarThreads from "./sidebar-threads";
import ChatView from "./chat-view";
import DiscoverContacts from "./discover-contacts";
import ProfileSettings from "./profile-settings";
import NewGroupView from "./new-group-view";
import { ChatThread, Contact, ProfileSettings as ProfileSettingsType } from "./types";

interface DesktopViewProps {
  appTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  desktopScreen: 'chats' | 'discover' | 'profile';
  setDesktopScreen: (screen: 'chats' | 'discover' | 'profile') => void;
  chats: ChatThread[];
  activeChat: ChatThread | undefined;
  chatSearchQuery: string;
  setChatSearchQuery: (q: string) => void;
  setActiveChatId: (id: string) => void;
  contacts: Contact[];
  discoverSearchQuery: string;
  setDiscoverSearchQuery: (q: string) => void;
  onConnectChat: (id: string) => void;
  profileSettings: ProfileSettingsType;
  setProfileSettings: React.Dispatch<React.SetStateAction<ProfileSettingsType>>;
  onSaveProfile: () => void;
  hasSavedIndicator: boolean;
  groupName: string;
  setGroupName: (val: string) => void;
  groupSearch: string;
  setGroupSearch: (val: string) => void;
  selectedGroupContacts: string[];
  onToggleGroupContact: (id: string) => void;
  onConfirmGroupCreation: () => void;
  msgText: string;
  setMsgText: (txt: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  onLogout?: () => void;
  connectionStatus?: string;
}

export default function DesktopView({
  appTheme,
  onToggleTheme,
  desktopScreen,
  setDesktopScreen,
  chats,
  activeChat,
  chatSearchQuery,
  setChatSearchQuery,
  setActiveChatId,
  contacts,
  discoverSearchQuery,
  setDiscoverSearchQuery,
  onConnectChat,
  profileSettings,
  setProfileSettings,
  onSaveProfile,
  hasSavedIndicator,
  groupName,
  setGroupName,
  groupSearch,
  setGroupSearch,
  selectedGroupContacts,
  onToggleGroupContact,
  onConfirmGroupCreation,
  msgText: msgText,
  setMsgText: setMsgText,
  onSendMessage: onSendMessage,
  isTyping: isTyping,
  onLogout: onLogout,
  connectionStatus: connectionStatus
}: DesktopViewProps) {
  // Mode inside desktop screen to decide if we are showing Group creator
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [isMobileChatActive, setIsMobileChatActive] = useState<boolean>(false);

  return (
    <div className="w-full h-screen flex flex-col select-none bg-[#f4f5f9] dark:bg-[#101424]">
      {/* Desktop Wrapper Layout resembling standard high-fidelity client */}
      <div className="w-full flex-1 flex overflow-hidden bg-card text-card-foreground">
        
        {/* PANEL 1: STATIC ICON SIDEBAR */}
        <div className="hidden md:flex w-16 bg-[#18181c] dark:bg-[#0c0d12] flex-col justify-between items-center py-4 shrink-0 border-r border-muted/20">
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Logo Sphere */}
            <div className="h-10 w-12 flex items-center justify-center">
              <img src="/tchrd-logo-small.svg" alt="Logo" className="h-6 w-auto max-w-full object-contain" />
            </div>

            {/* Icon list */}
            <div className="flex flex-col gap-3 w-full px-2.5">
              <Tooltip>
                <TooltipTrigger
                  id="desktop-tab-chats"
                  onClick={() => {
                    setDesktopScreen('chats');
                    setIsCreatingGroup(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${
                    desktopScreen === 'chats' && !isCreatingGroup
                      ? 'bg-[#0076FF] text-white' 
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Conversations</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  id="desktop-tab-discover"
                  onClick={() => {
                    setDesktopScreen('discover');
                    setIsCreatingGroup(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${
                    desktopScreen === 'discover' 
                      ? 'bg-[#0076FF] text-white' 
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                  }`}
                >
                  <Compass className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Discover Colleagues</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  id="desktop-tab-profile"
                  onClick={() => {
                    setDesktopScreen('profile');
                    setIsCreatingGroup(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${
                    desktopScreen === 'profile' 
                      ? 'bg-[#0076FF] text-white' 
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                  }`}
                >
                  <User className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Preferences</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* User profile avatar toggle at base */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-9 w-9 border border-gray-700">
                <AvatarImage src={profileSettings.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"} alt="Me" className="object-cover" />
                <AvatarFallback>{profileSettings.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#18181c]" />
            </div>
          </div>
        </div>

        {/* PANEL 2: SWITCHABLE MIDDLE PANEL */}
        <div className={`border-r border-muted flex flex-col bg-card relative ${
          isMobileChatActive && desktopScreen === 'chats' && !isCreatingGroup
            ? 'hidden md:flex md:w-80 md:shrink-0' 
            : 'flex w-full md:w-80 md:shrink-0 h-full'
        }`}>
          <div className="flex-1 min-h-0 relative">
            {isCreatingGroup ? (
              <NewGroupView
                contacts={contacts}
                groupName={groupName}
                onGroupNameChange={setGroupName}
                groupSearch={groupSearch}
                onGroupSearchChange={setGroupSearch}
                selectedGroupContacts={selectedGroupContacts}
                onToggleContact={onToggleGroupContact}
                onClose={() => setIsCreatingGroup(false)}
                onConfirm={() => {
                  onConfirmGroupCreation();
                  setIsCreatingGroup(false);
                  setIsMobileChatActive(true);
                }}
              />
            ) : desktopScreen === 'chats' ? (
              <SidebarThreads
                threads={chats}
                activeId={activeChat?.id || ''}
                searchQuery={chatSearchQuery}
                onSearchChange={setChatSearchQuery}
                onSelectThread={(id) => {
                  setActiveChatId(id);
                  setIsMobileChatActive(true);
                }}
                onNewGroupClick={() => setIsCreatingGroup(true)}
              />
            ) : desktopScreen === 'discover' ? (
              <DiscoverContacts
                contacts={contacts}
                searchQuery={discoverSearchQuery}
                onSearchChange={setDiscoverSearchQuery}
                onConnectChat={(id) => {
                  onConnectChat(id);
                  setDesktopScreen('chats');
                  setIsMobileChatActive(true);
                }}
              />
            ) : (
              <ProfileSettings
                settings={profileSettings}
                onSettingsChange={setProfileSettings}
                onSave={onSaveProfile}
                hasSavedIndicator={hasSavedIndicator}
                appTheme={appTheme}
                onToggleTheme={onToggleTheme}
                onLogout={onLogout}
              />
            )}
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="md:hidden h-14 border-t bg-card/95 backdrop-blur-xs flex items-center justify-around shrink-0 w-full z-40">
            <button
              onClick={() => {
                setDesktopScreen('chats');
                setIsCreatingGroup(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${
                desktopScreen === 'chats' && !isCreatingGroup ? 'text-[#0076FF]' : 'text-muted-foreground'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span className="text-[9px] font-bold">Chats</span>
            </button>
            <button
              onClick={() => {
                setDesktopScreen('discover');
                setIsCreatingGroup(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${
                desktopScreen === 'discover' ? 'text-[#0076FF]' : 'text-muted-foreground'
              }`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span className="text-[9px] font-bold">Discover</span>
            </button>
            <button
              onClick={() => {
                setDesktopScreen('profile');
                setIsCreatingGroup(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${
                desktopScreen === 'profile' ? 'text-[#0076FF]' : 'text-muted-foreground'
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span className="text-[9px] font-bold">Profile</span>
            </button>
          </div>
        </div>

        {/* PANEL 3: CONSTANT BIG RIGHT CHAT VIEW STAGE */}
        <div className={`min-w-0 bg-muted/5 flex-col justify-between h-full relative ${
          isMobileChatActive && desktopScreen === 'chats' && !isCreatingGroup
            ? 'flex flex-1'
            : 'hidden md:flex md:flex-1'
        }`}>
          {desktopScreen === 'chats' && activeChat && !isCreatingGroup ? (
            <ChatView
              activeChat={activeChat}
              msgText={msgText}
              onMsgTextChange={setMsgText}
              onSendMessage={onSendMessage}
              isTyping={isTyping}
              onBackClick={() => setIsMobileChatActive(false)}
            />
          ) : (
            /* Blank overview guidelines screen when nothing active */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fcfdff] dark:bg-[#121626]">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-4">
                <Laptop className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-sm tracking-tight mb-2 text-foreground">
                Workspace Communication Deck
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Connect seamlessly with cross-functional experts. Create instant squads, share metrics dashboards, and customize display settings.
              </p>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 max-w-xs w-full text-left text-[11px] text-muted-foreground">
                <div className="bg-card p-2.5 rounded-xl border flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle className={`h-4 w-4 shrink-0 ${connectionStatus === 'Offline' ? 'text-rose-500' : connectionStatus === 'Connecting...' ? 'text-amber-550' : 'text-emerald-500'}`} />
                  <div>
                    <span className="font-semibold block text-foreground">API Connection</span>
                    <span className="text-[10px]">{connectionStatus || 'Synchronized'}</span>
                  </div>
                </div>
                <div className="bg-card p-2.5 rounded-xl border flex items-center gap-1.5 shadow-2xs">
                  <Clock className="h-4 w-4 text-[#0076FF] shrink-0" />
                  <div>
                    <span className="font-semibold block text-foreground">Local Session</span>
                    <span className="text-[10px]">Auto-saved</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
