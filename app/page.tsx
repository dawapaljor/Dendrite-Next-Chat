'use client';

import React, { useState, useEffect, useRef } from 'react';
import DesktopView from "@/components/messenger/desktop-view";
import { ChatThread, Contact, ProfileSettings } from "@/components/messenger/types";
import AuthView from "@/components/messenger/auth-view";
import { getMatrixClient, clearMatrixClient, getStoredSession } from "@/lib/matrix";
import type { MatrixClient, MatrixEvent } from "matrix-js-sdk";
import { translations, Language } from "@/lib/translations";

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
  const [lang, setLang] = useState<Language>('en');

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
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  const activeChatIdRef = useRef<string>('');
  const readRoomEventIds = useRef<Record<string, string>>({});
  const profileSettingsRef = useRef<ProfileSettings>(profileSettings);
  const syncStateRef = useRef<() => void>(() => {});

  // Sync activeChatId to ref to avoid stale closures in the Matrix sync loop
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Sync profileSettings to ref to avoid stale closures in the Matrix sync loop
  useEffect(() => {
    profileSettingsRef.current = profileSettings;
  }, [profileSettings]);

  // Initial load from localstorage cache
  useEffect(() => {
    const savedTheme = localStorage.getItem('saas_theme');
    const savedProfile = localStorage.getItem('saas_profile');
    const savedLang = localStorage.getItem('app_language');
    
    if (savedLang === 'en' || savedLang === 'bo') {
      setLang(savedLang);
    }
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
          ? (matrixClient.mxcUrlToHttp(profile.avatar_url) || undefined)
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

    const isRoomDirect = (roomId: string) => {
      // 1. Check account data m.direct first
      const directEvent = matrixClient.getAccountData("m.direct");
      if (directEvent) {
        const content = directEvent.getContent();
        for (const userId in content) {
          if (Array.isArray(content[userId]) && content[userId].includes(roomId)) {
            return true;
          }
        }
      }

      // 2. Fallback check: DMs have <= 2 members and do NOT have an explicit room name state event set
      const room = matrixClient.getRoom(roomId);
      if (room) {
        const nameEvent = room.currentState.getStateEvents("m.room.name", "");
        const members = room.getJoinedMembers();
        if (!nameEvent && members.length <= 2) {
          return true;
        }
      }

      return false;
    };

    const syncState = () => {
      if (!active) return;
      
      const rooms = matrixClient.getRooms().filter(room => room.getMyMembership() === "join");
      
      const mappedRooms: ChatThread[] = rooms.map(room => {
        const members = room.getJoinedMembers();
        const isDirect = isRoomDirect(room.roomId);
        let displayName = room.name || room.roomId;
        if (isDirect && members.length <= 2) {
          const otherMember = members.find(m => m.userId !== matrixClient.getUserId());
          if (otherMember && otherMember.name) {
            displayName = otherMember.name;
          }
        }
        if (displayName.startsWith('@') && displayName.includes(':')) {
          displayName = displayName.split(':')[0].substring(1);
        }
        const timeline = room.getLiveTimeline().getEvents();
        
        const mappedMessages = timeline
          .filter(event => event.getType() === "m.room.message")
          .map(event => {
            const content = event.getContent();
            const senderId = event.getSender();
            const isMe = senderId === matrixClient.getUserId();
            const senderMember = senderId ? room.getMember(senderId) : null;
            const senderName = senderMember?.name || senderId || 'Unknown';
            let senderAvatar = '';
            if (isMe) {
              senderAvatar = profileSettingsRef.current.avatarUrl || '';
            } else {
              const senderMxc = senderMember?.getMxcAvatarUrl();
              senderAvatar = senderMxc 
                ? matrixClient.mxcUrlToHttp(senderMxc) || ''
                : '';
            }

            return {
              sender: isMe ? 'me' : 'receiver',
              senderName: senderName,
              senderAvatar: senderAvatar,
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

        const selfUserId = matrixClient.getUserId();
        const selfMember = selfUserId ? room.getMember(selfUserId) : null;
        const isAdmin = selfMember ? selfMember.powerLevel >= 100 : false;

        const mappedMembers: Contact[] = members.map(m => {
          const memberMxcUrl = m.getMxcAvatarUrl();
          const memberAvatarUrl = memberMxcUrl 
            ? matrixClient.mxcUrlToHttp(memberMxcUrl) || undefined
            : undefined;

          let displayRole = 'Member';
          if (m.userId === matrixClient.getUserId()) {
            displayRole = m.powerLevel >= 100 ? 'Admin (Me)' : 'Me';
          } else if (m.powerLevel >= 100) {
            displayRole = 'Admin';
          } else if (m.powerLevel >= 50) {
            displayRole = 'Moderator';
          }

          return {
            id: m.userId,
            name: m.name || m.userId,
            role: displayRole,
            avatar: memberAvatarUrl || '',
            online: getUserOnlineStatus(m.userId)
          };
        });

        const otherMember = room.getJoinedMembers().find(m => m.userId !== matrixClient.getUserId());
        const isOnline = otherMember ? getUserOnlineStatus(otherMember.userId) : false;

        const lastEvent = timeline.length > 0 ? timeline[timeline.length - 1] : null;
        const lastEventId = lastEvent?.getId();
        const locallyReadEventId = readRoomEventIds.current[room.roomId];

        let unreadCount = room.getUnreadNotificationCount("total" as any);
        if (room.roomId === activeChatIdRef.current) {
          unreadCount = 0;
        } else if (locallyReadEventId && lastEventId === locallyReadEventId) {
          unreadCount = 0;
        }

        let roomAvatar = '';
        const roomAvatarMxc = room.getAvatarUrl(matrixClient.baseUrl, 96, 96, 'scale');
        if (roomAvatarMxc) {
          const httpUrl = matrixClient.mxcUrlToHttp(roomAvatarMxc);
          if (httpUrl) {
            roomAvatar = httpUrl;
          }
        }

        if (!roomAvatar && members.length <= 2) {
          const otherMember = members.find(m => m.userId !== matrixClient.getUserId());
          const otherMemberMxc = otherMember?.getMxcAvatarUrl();
          if (otherMemberMxc) {
            const httpUrl = matrixClient.mxcUrlToHttp(otherMemberMxc);
            if (httpUrl) {
              roomAvatar = httpUrl;
            }
          }
        }

        return {
          id: room.roomId,
          name: displayName,
          avatar: roomAvatar,
          initials: displayName.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase(),
          lastMessage: lastMsgText,
          time: lastMsgTime,
          unreadCount: unreadCount,
          online: isOnline ? true : 'offline',
          isGroup: !isDirect,
          messages: mappedMessages,
          topic: topic,
          members: mappedMembers,
          isAdmin: isAdmin
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
            ? matrixClient.mxcUrlToHttp(memberMxcUrl) || undefined
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
      
      syncStateRef.current = syncState;
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

  // Send read receipt when active chat changes or new messages arrive in active chat
  useEffect(() => {
    if (!matrixClient || !activeChatId) return;

    const sendReadReceipt = async () => {
      const room = matrixClient.getRoom(activeChatId);
      if (!room) return;

      const timeline = room.getLiveTimeline().getEvents();
      if (timeline.length === 0) return;
      
      const lastEvent = timeline[timeline.length - 1];
      const lastEventId = lastEvent.getId();
      if (lastEventId) {
        readRoomEventIds.current[activeChatId] = lastEventId;
      }

      try {
        await matrixClient.sendReadReceipt(lastEvent);
        // Clear unread count locally for instant UI update
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId && chat.unreadCount > 0) {
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        }));
      } catch (err) {
        console.error("Failed to send Matrix read receipt:", err);
      }
    };

    sendReadReceipt();

    // Listen for new messages in this room to mark them as read
    const onRoomTimeline = (event: MatrixEvent) => {
      if (event.getRoomId() === activeChatId && event.getType() === "m.room.message") {
        sendReadReceipt();
      }
    };

    matrixClient.on("Room.timeline" as any, onRoomTimeline);

    return () => {
      if (matrixClient) {
        matrixClient.removeListener("Room.timeline" as any, onRoomTimeline);
      }
    };
  }, [matrixClient, activeChatId]);

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
            ? matrixClient.mxcUrlToHttp(u.avatar_url) || undefined
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
    
    // Clear local profile storage and reset profileSettings to default values
    localStorage.removeItem('saas_profile');
    setProfileSettings({
      username: '',
      role: '',
      email: '',
      phone: '',
      language: 'English (United States)',
      twoFactor: true,
      readReceipts: true,
      avatarUrl: undefined
    });
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    let updatedProfile = { ...profileSettings };
    
    if (matrixClient) {
      const userId = matrixClient.getUserId();
      if (userId) {
        try {
          const profile = await matrixClient.getProfileInfo(userId);
          if (profileSettings.username && profileSettings.username !== profile.displayname) {
            await matrixClient.setDisplayName(profileSettings.username);
          }

          // Upload custom SVG avatar to Matrix homeserver media repository
          if (profileSettings.avatarUrl && profileSettings.avatarUrl.startsWith('/avatar/')) {
            try {
              const res = await fetch(profileSettings.avatarUrl);
              const blob = await res.blob();
              const filename = profileSettings.avatarUrl.split('/').pop() || 'avatar.svg';
              const uploadResult = await matrixClient.uploadContent(blob, {
                type: "image/svg+xml",
                name: filename,
              });
              if (uploadResult && uploadResult.content_uri) {
                await matrixClient.setAvatarUrl(uploadResult.content_uri);
                const httpUrl = matrixClient.mxcUrlToHttp(uploadResult.content_uri);
                if (httpUrl) {
                  updatedProfile.avatarUrl = httpUrl;
                }
              }
            } catch (uploadErr) {
              console.error("Failed to upload custom avatar SVG to Matrix media repository:", uploadErr);
            }
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

    setProfileSettings(updatedProfile);
    localStorage.setItem('saas_profile', JSON.stringify(updatedProfile));

    setIsSavingProfile(false);
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

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    if (!matrixClient) {
      throw new Error("Matrix client not initialized");
    }

    const userId = matrixClient.getUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }

    try {
      const authDict: any = {
        type: "m.login.password",
        identifier: {
          type: "m.id.user",
          user: userId,
        },
        password: oldPass,
      };

      try {
        await matrixClient.setPassword(authDict, newPass, true);
      } catch (err: any) {
        if (err.httpStatus === 401 && err.data && err.data.session) {
          const session = err.data.session;
          const authDictWithSession = {
            ...authDict,
            session,
          };
          await matrixClient.setPassword(authDictWithSession, newPass, true);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Failed to change password:", err);
      const message = err.data?.error || err.message || JSON.stringify(err);
      throw new Error(message);
    }
  };

  const handleUpdateRoomDetails = async (roomId: string, updates: { name?: string; topic?: string; avatarFile?: File }) => {
    if (!matrixClient) return;
    try {
      if (updates.name !== undefined) {
        await matrixClient.setRoomName(roomId, updates.name);
      }
      if (updates.topic !== undefined) {
        await matrixClient.setRoomTopic(roomId, updates.topic);
      }
      if (updates.avatarFile !== undefined) {
        const uploadResult = await matrixClient.uploadContent(updates.avatarFile, {
          type: updates.avatarFile.type,
          name: updates.avatarFile.name,
        });
        if (uploadResult && uploadResult.content_uri) {
          await matrixClient.sendStateEvent(roomId, "m.room.avatar" as any, { url: uploadResult.content_uri }, "");
        }
      }
      if (syncStateRef.current) {
        syncStateRef.current();
      }
    } catch (err) {
      console.error("Failed to update room details:", err);
      throw err;
    }
  };

  const handleInviteUserToRoom = async (roomId: string, userId: string) => {
    if (!matrixClient) return;
    try {
      const targetUserId = userId.startsWith('@') ? userId : `@${userId}:im.tibcert.org`;
      await matrixClient.invite(roomId, targetUserId);
      if (syncStateRef.current) {
        syncStateRef.current();
      }
    } catch (err) {
      console.error("Failed to invite user to room:", err);
      throw err;
    }
  };

  const handleRemoveUserFromRoom = async (roomId: string, userId: string) => {
    if (!matrixClient) return;
    try {
      await matrixClient.kick(roomId, userId);
      if (syncStateRef.current) {
        syncStateRef.current();
      }
    } catch (err) {
      console.error("Failed to remove/kick user from room:", err);
      throw err;
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!matrixClient) return;
    try {
      await matrixClient.leave(roomId);
      setActiveChatId('');
      if (syncStateRef.current) {
        syncStateRef.current();
      }
    } catch (err) {
      console.error("Failed to leave room:", err);
      throw err;
    }
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  return (
    <div className={`h-screen w-full relative transition duration-200 overflow-hidden flex ${
      appTheme === 'dark' ? 'dark bg-[#101424] text-gray-100' : 'bg-[#f4f5f9] text-[#10193d]'
    } ${lang === 'bo' ? 'lang-bo' : ''}`}>
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
        isSavingProfile={isSavingProfile}
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
        lang={lang}
        setLang={setLang}
        onChangePassword={handleChangePassword}
        onUpdateRoomDetails={handleUpdateRoomDetails}
        onInviteUser={handleInviteUserToRoom}
        onRemoveUser={handleRemoveUserFromRoom}
        onLeaveRoom={handleLeaveRoom}
      />
    </div>
  );
}


