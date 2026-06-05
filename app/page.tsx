'use client';

import React, { useState, useEffect, useRef } from 'react';
import DesktopView from "@/components/messenger/desktop-view";
import { ChatThread, Contact, ProfileSettings } from "@/components/messenger/types";
import AuthView from "@/components/messenger/auth-view";
import { getMatrixClient, clearMatrixClient, getStoredSession } from "@/lib/matrix";
import type { MatrixClient, MatrixEvent } from "matrix-js-sdk";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('MatrixRTCSessionManager')) {
      return;
    }
    originalError(...args);
  };
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [matrixClient, setMatrixClient] = useState<MatrixClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Offline');

  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('light');

  // --- MODEL DATA STATES ---
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);

  // --- INDIVIDUAL SIMULATOR STAGES ---
  const [desktopScreen, setDesktopScreen] = useState<'chats' | 'discover' | 'profile'>('chats');

  // --- ACTIVE MESSAGE FLOW ---
  const [msgText, setMsgText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // --- SQUAD BUILDER STATES ---
  const [groupName, setGroupName] = useState<string>('');
  const [groupSearch, setGroupSearch] = useState<string>('');
  const [selectedGroupContacts, setSelectedGroupContacts] = useState<string[]>([]);

  // --- SEARCH QUERY STRINGS ---
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState<string>('');

  // --- PROFILE METADATA STATE ---
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: 'Alex Thompson',
    role: 'Senior UX Architect & Team Lead',
    email: 'alex.thompson@example.com',
    phone: '+1 (555) 019-2831',
    language: 'English (United States)',
    twoFactor: true,
    readReceipts: true
  });
  
  const [hasSavedIndicator, setHasSavedIndicator] = useState<boolean>(false);

  // Initial load from localstorage cache
  useEffect(() => {
    const savedTheme = localStorage.getItem('saas_theme');
    const savedProfile = localStorage.getItem('saas_profile');
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setAppTheme(savedTheme);
    }
    if (savedProfile) {
      try {
        setProfileSettings(JSON.parse(savedProfile));
      } catch (_) {}
    }

    const session = getStoredSession();
    if (session) {
      setIsAuthenticated(true);
      const client = getMatrixClient();
      if (client) {
        setMatrixClient(client);
      }
    }
  }, []);

  // Matrix Sync loop integration
  useEffect(() => {
    if (!matrixClient) return;

    let active = true;
    setConnectionStatus('Connecting...');

    const fetchMatrixProfile = async () => {
      const userId = matrixClient.getUserId();
      if (!userId) return;
      try {
        const profile = await matrixClient.getProfileInfo(userId);
        if (!active) return;

        const accountEvent = matrixClient.getAccountData("org.workspace.profile_settings");
        const accountData = accountEvent ? accountEvent.getContent() : {};

        const avatarUrl = profile.avatar_url 
          ? (matrixClient.mxcUrlToHttp(profile.avatar_url, 96, 96, "scale") || undefined)
          : undefined;

        setProfileSettings(prev => ({
          ...prev,
          username: profile.displayname || userId.split(':')[0].substring(1) || prev.username,
          avatarUrl: avatarUrl || prev.avatarUrl,
          role: accountData.role || prev.role,
          email: accountData.email || prev.email,
          phone: accountData.phone || prev.phone,
          language: accountData.language || prev.language,
          twoFactor: accountData.twoFactor !== undefined ? accountData.twoFactor : prev.twoFactor,
          readReceipts: accountData.readReceipts !== undefined ? accountData.readReceipts : prev.readReceipts,
        }));
      } catch (err) {
        console.error("Error fetching Matrix profile info:", err);
      }
    };

    const getUserOnlineStatus = (userId: string): boolean => {
      const user = matrixClient.getUser(userId);
      if (!user) return false;
      return user.presence === 'online' || user.currentlyActive === true;
    };

    const syncState = () => {
      if (!active) return;
      
      const rooms = matrixClient.getRooms();
      
      const mappedRooms: ChatThread[] = rooms.map(room => {
        const members = room.getJoinedMembers();
        const displayName = room.name || room.roomId;
        const timeline = room.getLiveTimeline().getEvents();
        
        const mappedMessages = timeline
          .filter(event => event.getType() === "m.room.message")
          .map(event => {
            const content = event.getContent();
            const senderId = event.getSender();
            const isMe = senderId === matrixClient.getUserId();
            const senderName = senderId ? (room.getMember(senderId)?.name || senderId) : 'Unknown';
            return {
              sender: isMe ? 'me' : 'receiver',
              senderName: senderName,
              text: content.body || '',
              time: new Date(event.getTs()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isImage: content.msgtype === "m.image"
            };
          });

        const lastMsgEvent = timeline.findLast(event => event.getType() === "m.room.message");
        const lastMsgText = lastMsgEvent ? lastMsgEvent.getContent().body : "No messages yet";
        const lastMsgTime = lastMsgEvent ? new Date(lastMsgEvent.getTs()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        
        const topicEvent = room.currentState.getStateEvents("m.room.topic", "");
        const topic = topicEvent ? topicEvent.getContent().topic : "";

        const mappedMembers: Contact[] = members.map(m => {
          const memberMxcUrl = m.getMxcAvatarUrl();
          const memberAvatarUrl = memberMxcUrl 
            ? matrixClient.mxcUrlToHttp(memberMxcUrl, 96, 96, "scale") || undefined
            : undefined;

          return {
            id: m.userId,
            name: m.name || m.userId,
            role: m.userId === matrixClient.getUserId() ? 'Me' : 'Member',
            avatar: memberAvatarUrl || '',
            online: getUserOnlineStatus(m.userId)
          };
        });

        const otherMember = room.getJoinedMembers().find(m => m.userId !== matrixClient.getUserId());
        const isOnline = otherMember ? getUserOnlineStatus(otherMember.userId) : false;

        return {
          id: room.roomId,
          name: displayName,
          avatar: '',
          initials: displayName.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase(),
          lastMessage: lastMsgText,
          time: lastMsgTime,
          unreadCount: room.getUnreadNotificationCount("total" as any),
          online: isOnline ? true : 'offline',
          isGroup: members.length > 2,
          messages: mappedMessages,
          topic: topic,
          members: mappedMembers
        };
      });

      // Collect dynamically found contacts from joined rooms
      const mappedContactsMap = new Map<string, Contact>();
      
      // Overlay real matrix members
      rooms.forEach(room => {
        room.getJoinedMembers().forEach(member => {
          if (member.userId === matrixClient.getUserId()) return;
          
          const memberMxcUrl = member.getMxcAvatarUrl();
          const memberAvatarUrl = memberMxcUrl 
            ? matrixClient.mxcUrlToHttp(memberMxcUrl, 96, 96, "scale") || undefined
            : undefined;

          mappedContactsMap.set(member.userId, {
            id: member.userId,
            name: member.name || member.userId,
            role: 'Matrix Contributor',
            avatar: memberAvatarUrl || '',
            online: getUserOnlineStatus(member.userId),
            suggested: false
          });
        });
      });

      setChats(mappedRooms);
      setContacts(Array.from(mappedContactsMap.values()));

      // Set active chat if not set
      if (mappedRooms.length > 0) {
        setActiveChatId(prev => {
          if (!prev) return mappedRooms[0].id;
          if (mappedRooms.some(r => r.id === prev)) return prev;
          return mappedRooms[0].id;
        });
      }
    };

    const onSync = (state: string, prevState: string | null) => {
      if (!active) return;
      if (state === "PREPARED" || state === "SYNCING") {
        setConnectionStatus('Synchronized');
        
        if (state === "PREPARED") {
          fetchMatrixProfile();
          matrixClient.setPresence({ presence: "online" }).catch(err => {
            console.error("Failed to set Matrix presence to online:", err);
          });
        }

        // Auto-join invited rooms
        const rooms = matrixClient.getRooms();
        rooms.forEach(room => {
          const selfUserId = matrixClient.getUserId();
          if (selfUserId) {
            const member = room.getMember(selfUserId);
            if (member && member.membership === "invite") {
              matrixClient.joinRoom(room.roomId)
                .then(() => {
                  console.log("Auto-joined invited room:", room.roomId);
                  syncState();
                })
                .catch(err => {
                  console.error("Failed to auto-join invited room:", room.roomId, err);
                });
            }
          }
        });

        syncState();
      } else if (state === "ERROR") {
        setConnectionStatus('Offline');
      }
    };

    const onTimeline = (event: MatrixEvent) => {
      if (event.getType() === "m.room.message") {
        syncState();
      }
    };

    const onAccountData = (event: MatrixEvent) => {
      if (!active) return;
      if (event.getType() === "org.workspace.profile_settings") {
        const accountData = event.getContent();
        setProfileSettings(prev => ({
          ...prev,
          role: accountData.role || prev.role,
          email: accountData.email || prev.email,
          phone: accountData.phone || prev.phone,
          language: accountData.language || prev.language,
          twoFactor: accountData.twoFactor !== undefined ? accountData.twoFactor : prev.twoFactor,
          readReceipts: accountData.readReceipts !== undefined ? accountData.readReceipts : prev.readReceipts,
        }));
      }
    };

    const onPresence = (event: MatrixEvent) => {
      if (!active) return;
      syncState();
    };

    matrixClient.on("sync" as any, onSync);
    matrixClient.on("Room.timeline" as any, onTimeline);
    matrixClient.on("accountData" as any, onAccountData);
    matrixClient.on("User.presence" as any, onPresence);

    matrixClient.startClient({ initialSyncLimit: 20 }).catch(err => {
      console.error("Failed to start Matrix client:", err);
      setConnectionStatus('Offline');
    });

    syncState();

    return () => {
      active = false;
      if (matrixClient) {
        matrixClient.removeListener("sync" as any, onSync);
        matrixClient.removeListener("Room.timeline" as any, onTimeline);
        matrixClient.removeListener("accountData" as any, onAccountData);
        matrixClient.removeListener("User.presence" as any, onPresence);
        try {
          matrixClient.stopClient();
        } catch (_) {}
      }
    };
  }, [matrixClient]);

  // Discover Matrix server directory users when search query changes or on startup
  useEffect(() => {
    if (!matrixClient || !isAuthenticated) return;

    let active = true;
    
    const searchDirectory = async () => {
      try {
        const query = discoverSearchQuery.trim();
        // Call the Matrix user directory search endpoint
        const response = await matrixClient.searchUserDirectory({
          term: query || "a", // default to 'a' if empty to populate a list of users
          limit: 50
        });

        if (!active) return;

        const results = response.results || [];
        
        // Map Matrix user directory results to Contact type
        const directoryContacts: Contact[] = results.map((u, idx) => {
          const avatarUrl = u.avatar_url 
            ? matrixClient.mxcUrlToHttp(u.avatar_url, 96, 96, "scale") || undefined
            : undefined;

          // Retrieve user online state using global user store helper
          const userObj = matrixClient.getUser(u.user_id);
          const isOnline = userObj ? (userObj.presence === 'online' || userObj.currentlyActive === true) : false;

          return {
            id: u.user_id,
            name: u.display_name || u.user_id.split(':')[0].substring(1) || u.user_id,
            role: 'Matrix User',
            avatar: avatarUrl || '',
            online: isOnline,
            suggested: !query && idx < 4 // Mark first 4 as suggested if query is empty
          };
        });

        setContacts(prev => {
          // Keep only real room member contacts from prev state
          const roomMemberContacts = prev.filter(c => c.id.startsWith('@') && !results.some(u => u.user_id === c.id));
          // Combine with new directory contacts
          return [...roomMemberContacts, ...directoryContacts];
        });

      } catch (err) {
        console.error("Failed to query Matrix user directory:", err);
      }
    };

    // Debounce the directory search to avoid over-requesting
    const delayDebounce = setTimeout(() => {
      searchDirectory();
    }, 350);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [discoverSearchQuery, matrixClient, isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const client = getMatrixClient();
    if (client) {
      setMatrixClient(client);
    }
  };

  const handleLogout = () => {
    clearMatrixClient();
    setIsAuthenticated(false);
    setMatrixClient(null);
    setChats([]);
    setActiveChatId('');
    setConnectionStatus('Offline');
  };

  const handleSaveProfile = async () => {
    localStorage.setItem('saas_profile', JSON.stringify(profileSettings));
    
    if (matrixClient) {
      const userId = matrixClient.getUserId();
      if (userId) {
        try {
          const profile = await matrixClient.getProfileInfo(userId);
          if (profileSettings.username && profileSettings.username !== profile.displayname) {
            await matrixClient.setDisplayName(profileSettings.username);
          }

          const accountDataContent = {
            role: profileSettings.role,
            email: profileSettings.email,
            phone: profileSettings.phone,
            language: profileSettings.language,
            twoFactor: profileSettings.twoFactor,
            readReceipts: profileSettings.readReceipts
          };
          await matrixClient.setAccountData("org.workspace.profile_settings", accountDataContent);
        } catch (err) {
          console.error("Failed to save profile details to Matrix server:", err);
        }
      }
    }

    setHasSavedIndicator(true);
    setTimeout(() => {
      setHasSavedIndicator(false);
    }, 1800);
  };

  const handleToggleTheme = () => {
    const newTheme = appTheme === 'light' ? 'dark' : 'light';
    setAppTheme(newTheme);
    localStorage.setItem('saas_theme', newTheme);
  };

  // Send message action
  const handleSendMessage = async () => {
    if (!msgText.trim() || !activeChatId || !matrixClient) return;

    try {
      await matrixClient.sendMessage(activeChatId, {
        msgtype: "m.text" as any,
        body: msgText
      });
      setMsgText('');
    } catch (err) {
      console.error("Failed to send message via Matrix:", err);
    }
  };

  // Connect or open chat with specific contacts
  const handleConnectChat = async (contactId: string) => {
    if (!matrixClient) return;

    const rooms = matrixClient.getRooms();
    const targetUserId = contactId.startsWith('@') ? contactId : `@${contactId}:im.tibcert.org`;

    const existingDirectRoom = rooms.find(room => {
      const members = room.getJoinedMembers();
      return members.length === 2 && members.some(m => m.userId === targetUserId);
    });

    if (existingDirectRoom) {
      setActiveChatId(existingDirectRoom.roomId);
      setDesktopScreen('chats');
      return;
    }

    try {
      const createResponse = await matrixClient.createRoom({
        invite: [targetUserId],
        is_direct: true,
        visibility: "private" as any,
        preset: "private_chat" as any
      });
      
      setActiveChatId(createResponse.room_id);
      setDesktopScreen('chats');
    } catch (err) {
      console.error("Failed to establish Matrix direct chat:", err);
    }
  };

  // Group thread creation action
  const handleConfirmGroupCreation = async () => {
    if (selectedGroupContacts.length === 0 || !matrixClient) return;

    const trimmedGroupName = groupName.trim() || "Squad Alignment Channel";
    const invitees = selectedGroupContacts.map(cid => 
      cid.startsWith('@') ? cid : `@${cid}:im.tibcert.org`
    );

    try {
      const createResponse = await matrixClient.createRoom({
        name: trimmedGroupName,
        invite: invitees,
        visibility: "private" as any,
        preset: "private_chat" as any
      });

      setActiveChatId(createResponse.room_id);
      setDesktopScreen('chats');
      
      // reset builder states
      setGroupName('');
      setSelectedGroupContacts([]);
    } catch (err) {
      console.error("Failed to create Matrix group room:", err);
    }
  };

  const handleToggleGroupContact = (id: string) => {
    setSelectedGroupContacts(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  return (
    <div className={`h-screen w-full relative transition duration-200 overflow-hidden flex ${
      appTheme === 'dark' ? 'dark bg-[#101424] text-gray-100' : 'bg-[#f4f5f9] text-[#10193d]'
    }`}>
      <DesktopView
        appTheme={appTheme}
        onToggleTheme={handleToggleTheme}
        desktopScreen={desktopScreen}
        setDesktopScreen={setDesktopScreen}
        chats={chats}
        activeChat={activeChat}
        chatSearchQuery={chatSearchQuery}
        setChatSearchQuery={setChatSearchQuery}
        setActiveChatId={setActiveChatId}
        contacts={contacts}
        discoverSearchQuery={discoverSearchQuery}
        setDiscoverSearchQuery={setDiscoverSearchQuery}
        onConnectChat={handleConnectChat}
        profileSettings={profileSettings}
        setProfileSettings={setProfileSettings}
        onSaveProfile={handleSaveProfile}
        hasSavedIndicator={hasSavedIndicator}
        groupName={groupName}
        setGroupName={setGroupName}
        groupSearch={groupSearch}
        setGroupSearch={setGroupSearch}
        selectedGroupContacts={selectedGroupContacts}
        onToggleGroupContact={handleToggleGroupContact}
        onConfirmGroupCreation={handleConfirmGroupCreation}
        msgText={msgText}
        setMsgText={setMsgText}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        onLogout={handleLogout}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}


