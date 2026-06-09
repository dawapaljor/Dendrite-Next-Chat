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
import { translations, Language } from "@/lib/translations";

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
  currentUserId?: string;
  profileSettings: ProfileSettingsType;
  setProfileSettings: React.Dispatch<React.SetStateAction<ProfileSettingsType>>;
  onSaveProfile: (overrides?: ProfileSettingsType) => Promise<void> | void;
  isSavingProfile?: boolean;
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
  lang: Language;
  setLang: (l: Language) => void;
  onChangePassword?: (oldPass: string, newPass: string) => Promise<void>;
  onUpdateRoomDetails?: (roomId: string, updates: { name?: string; topic?: string; avatarFile?: File }) => Promise<void>;
  onInviteUser?: (roomId: string, userId: string) => Promise<void>;
  onRemoveUser?: (roomId: string, userId: string) => Promise<void>;
  onLeaveRoom?: (roomId: string) => Promise<void>;
  onSendMediaMessage?: (file: File, isVoice?: boolean) => Promise<void>;
  onShareContactCard?: (cardData: any) => Promise<void> | void;
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
  currentUserId,
  profileSettings,
  setProfileSettings,
  onSaveProfile,
  isSavingProfile,
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
  connectionStatus: connectionStatus,
  lang,
  setLang,
  onChangePassword,
  onUpdateRoomDetails,
  onInviteUser,
  onRemoveUser,
  onLeaveRoom,
  onSendMediaMessage,
  onShareContactCard
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
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${desktopScreen === 'chats' && !isCreatingGroup
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                    }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{translations[lang].chatsTab}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  id="desktop-tab-discover"
                  onClick={() => {
                    setDesktopScreen('discover');
                    setIsCreatingGroup(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${desktopScreen === 'discover'
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                    }`}
                >
                  <Compass className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{translations[lang].discoverTab}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  id="desktop-tab-profile"
                  onClick={() => {
                    setDesktopScreen('profile');
                    setIsCreatingGroup(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex justify-center w-full cursor-pointer bg-transparent border-0 outline-none ${desktopScreen === 'profile'
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:bg-[#2e2e38] hover:text-white'
                    }`}
                >
                  <User className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{translations[lang].profileTab}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* User profile avatar toggle at base */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-9 w-9 border border-gray-700 rounded-full">
                <AvatarImage src={profileSettings.avatarUrl} alt="Me" className="object-cover rounded-full" />
                <AvatarFallback className="bg-[#e4ebff] text-slate-800 text-xs font-bold rounded-full">
                  {profileSettings.username ? profileSettings.username.substring(0, 2).toUpperCase() : 'ME'}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#18181c]" />
            </div>
          </div>
        </div>

        {/* PANEL 2: SWITCHABLE MIDDLE PANEL */}
        <div className={`border-r border-muted flex flex-col h-full bg-card relative ${isMobileChatActive && desktopScreen === 'chats' && !isCreatingGroup
            ? 'hidden md:flex md:w-80 md:shrink-0'
            : 'flex w-full md:w-80 md:shrink-0'
          }`}>
          <div className="flex-1 min-h-0 relative flex flex-col">
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
                lang={lang}
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
                lang={lang}
              />
            ) : desktopScreen === 'discover' ? (
              <DiscoverContacts
                contacts={contacts}
                chats={chats}
                searchQuery={discoverSearchQuery}
                onSearchChange={setDiscoverSearchQuery}
                onConnectChat={(id) => {
                  onConnectChat(id);
                  setDesktopScreen('chats');
                  setIsMobileChatActive(true);
                }}
                onConnectRoom={(roomId) => {
                  setActiveChatId(roomId);
                  setDesktopScreen('chats');
                  setIsMobileChatActive(true);
                }}
                lang={lang}
              />
            ) : (
              <ProfileSettings
                settings={profileSettings}
                onSettingsChange={setProfileSettings}
                onSave={onSaveProfile}
                isSaving={isSavingProfile}
                hasSavedIndicator={hasSavedIndicator}
                appTheme={appTheme}
                onToggleTheme={onToggleTheme}
                onLogout={onLogout}
                lang={lang}
                setLang={setLang}
                onChangePassword={onChangePassword}
                onShareContactCard={onShareContactCard}
                hasActiveChat={!!activeChat}
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
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${desktopScreen === 'chats' && !isCreatingGroup ? 'text-brand' : 'text-muted-foreground'
                }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span className="text-[9px] font-bold">{translations[lang].chatsTab}</span>
            </button>
            <button
              onClick={() => {
                setDesktopScreen('discover');
                setIsCreatingGroup(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${desktopScreen === 'discover' ? 'text-brand' : 'text-muted-foreground'
                }`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span className="text-[9px] font-bold">{translations[lang].discoverTab}</span>
            </button>
            <button
              onClick={() => {
                setDesktopScreen('profile');
                setIsCreatingGroup(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 transition bg-transparent border-0 outline-none cursor-pointer ${desktopScreen === 'profile' ? 'text-brand' : 'text-muted-foreground'
                }`}
            >
              <Avatar className="h-4.5 w-4.5 border border-muted-foreground/25 rounded-full shrink-0">
                <AvatarImage src={profileSettings.avatarUrl} alt="Me" className="object-cover rounded-full" />
                <AvatarFallback className="bg-brand-light text-brand-light-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                  {profileSettings.username ? profileSettings.username.substring(0, 2).toUpperCase() : 'ME'}
                </AvatarFallback>
              </Avatar>
              <span className="text-[9px] font-bold">{translations[lang].profileTab}</span>
            </button>
          </div>
        </div>

        {/* PANEL 3: CONSTANT BIG RIGHT CHAT VIEW STAGE */}
        <div className={`min-w-0 bg-muted/5 flex-col justify-between h-full relative ${isMobileChatActive && desktopScreen === 'chats' && !isCreatingGroup
            ? 'flex flex-1'
            : 'hidden md:flex md:flex-1'
          }`}>
          {desktopScreen === 'chats' && activeChat && !isCreatingGroup ? (
            <ChatView
              key={activeChat.id}
              activeChat={activeChat}
              msgText={msgText}
              onMsgTextChange={setMsgText}
              onSendMessage={onSendMessage}
              isTyping={isTyping}
              onBackClick={() => setIsMobileChatActive(false)}
              lang={lang}
              onUpdateRoomDetails={onUpdateRoomDetails}
              onInviteUser={onInviteUser}
              onRemoveUser={onRemoveUser}
              onLeaveRoom={onLeaveRoom}
              onSendMediaMessage={onSendMediaMessage}
              onConnectChat={onConnectChat}
              currentUserId={currentUserId}
              profileSettings={profileSettings}
              onShareContactCard={onShareContactCard}
            />
          ) : (
            /* Blank overview guidelines screen when nothing active */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fcfdff] dark:bg-[#121626]">
              <div className="h-16 w-16 rounded-full bg-brand-light text-brand flex items-center justify-center mb-4">
                <Laptop className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-sm tracking-tight mb-2 text-foreground">
                {translations[lang].workspaceDeck}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                {translations[lang].workspaceDeckDesc}
              </p>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 max-w-xs w-full text-left text-[11px] text-muted-foreground">
                <div className="bg-card  rounded-xl border flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle className={`h-4 w-4 shrink-0 ${connectionStatus === 'Offline' ? 'text-rose-500' : connectionStatus === 'Connecting...' ? 'text-amber-550' : 'text-emerald-500'}`} />
                  <div>
                    <span className="font-semibold block text-foreground">{translations[lang].connectionStatusLabel}</span>
                    <span className="text-[10px]">
                      {connectionStatus === 'Offline' ? translations[lang].offline : connectionStatus === 'Connecting...' ? translations[lang].connecting : translations[lang].synchronized}
                    </span>
                  </div>
                </div>
                <div className="bg-card p-2.5 rounded-xl border flex items-center gap-1.5 shadow-2xs">
                  <Clock className="h-4 w-4 text-brand shrink-0" />
                  <div>
                    <span className="font-semibold block text-foreground">{translations[lang].localSession}</span>
                    <span className="text-[10px]">{translations[lang].autoSaved}</span>
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
