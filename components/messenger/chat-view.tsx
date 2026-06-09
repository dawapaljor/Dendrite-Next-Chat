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
  Edit,
  // New icons
  Mic,
  Volume2,
  Play,
  Pause,
  Download,
  FileText,
  Trash2,
  Paperclip,
  Check,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ChatThread, ProfileSettings } from "./types";
import { translations, Language } from "@/lib/translations";
import { FEATURE_FLAGS } from "@/lib/config";

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😋', '😛', '😜', '😎', '🥳', '😏', '😒', '😔', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '🤫', '🤔', '🤗', '🫣', '🫡', '🫵']
  },
  {
    name: 'People',
    icon: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👄', '💋', '🩸']
  },
  {
    name: 'Nature',
    icon: '🐱',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦩', '🦢', '🦫', '🦦', '🦥', '🦨', '🐿️']
  },
  {
    name: 'Food',
    icon: '🍔',
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🥞', ' waffle', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥚', '🍳', '🥘', '🍲', '🍿', '🧈', '🧂', '🍣', '🍤', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃']
  },
  {
    name: 'Activities',
    icon: '⚽',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', ' skate', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '♟️', '🎯', ' bowling', '🎮', '🧩']
  },
  {
    name: 'Travel',
    icon: '🚀',
    emojis: ['🚗', '🚕', '🚙', 'Bus', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚜', '🛵', '🚲', '🛴', '🚋', '🚄', '🚅', '🚂', '🚁', '✈️', '🚀', '🛸', '🛰️', '⛵', '⚓', '⛽', '🚧', '🗺️', '🧭', '🗼', '🗽', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏙️', '🏚️', '🏢', '🏡', '⛪', '🕌', '🕍', '🏥', '🏫', '🏨', '🏛️']
  },
  {
    name: 'Objects',
    icon: '💡',
    emojis: ['⌚', '📱', '💻', 'Keyboard', '🖱️', '🖥️', '🖨️', '💾', '💿', '📀', '📷', '📸', '📹', '🎥', '📞', '📺', '📻', '🎙️', '⏰', '⏳', '💡', 'Flashlight', '🕯️', '💵', '🪙', '💳', '✉️', '📧', '📦', '✏️', '✒️', '📝', '💼', '📁', '📂', '📅', '📆', '📖', '📕', '📗', '📘', '📚', '🔖', '🔗', '📎', '📐', '📏', '📌', '📍', 'Scissors', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛡️', '⚙️']
  },
  {
    name: 'Symbols',
    icon: '🔣',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '🌟', '⭐', '✨', '⚡', '💥', '🔥', '🌈', '☀️', '❄️', '🌊', '💤', '💢', '💬', '💭', '💯', '🔔', '🔕', '🔄', '🔁', '🔀', '➕', '➖', '✖️', '➗', '♾️', '❓', '❔', '❕', '❗', '🛑', '⛔', '🚫', '⚠️', '🚸', '🔞', '✅', '❌']
  },
  {
    name: 'Flags',
    icon: '🏳️',
    emojis: ['🏁', '🚩', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇯🇵', '🇩🇪', '🇫🇷', '🇮🇹', '🇪🇸', '🇷🇺', '🇨🇳', '🇮🇩', '🇮🇳', '🇧🇷', '🇿🇦', '🇰🇷', '🇲🇽', '🇸🇬', '🇳🇵', '🇧🇹', '🇲🇲', '🇹🇭', '🇻🇳', '🇱ཀ']
  }
];

interface CustomAudioPlayerProps {
  src: string;
  lang: string;
}

export function CustomAudioPlayer({ src, lang }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const barsCount = 20;
  const barHeights = [4, 6, 8, 5, 9, 11, 7, 5, 8, 12, 10, 6, 8, 5, 9, 7, 10, 8, 6, 4];

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    
    const onLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onDurationChange = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('durationchange', onDurationChange);
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('durationchange', onDurationChange);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const litBarsCount = Math.floor((progressPercent / 100) * barsCount);

  return (
    <div className="flex items-center gap-3 p-2.5 bg-muted/40 border border-muted/20 rounded-2xl w-64 md:w-72 shadow-xs transition duration-200 select-none">
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 active:scale-95 flex items-center justify-center transition shrink-0 shadow-sm cursor-pointer border-none"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-end gap-0.5 h-6 mb-1 overflow-hidden">
          {barHeights.map((h, i) => {
            const isLit = i < litBarsCount;
            return (
              <span
                key={i}
                className={`w-[3px] rounded-full transition duration-150 shrink-0 ${
                  isLit ? 'bg-brand' : 'bg-muted-foreground/30'
                }`}
                style={{ height: `${h * 1.8}px` }}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
          <span>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '0:10'}</span>
          <span className="font-semibold uppercase tracking-wider text-[8px] flex items-center gap-1">
            <Volume2 className="w-2.5 h-2.5" />
            {lang === 'bo' ? 'སྐད་འཕྲིན།' : 'VOICE'}
          </span>
        </div>
      </div>
    </div>
  );
}

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

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const detectUrls = (text: string): string[] => {
  const matches = text.match(URL_REGEX);
  return matches ? matches : [];
};

const isImageOrGifUrl = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname.toLowerCase();
    return (
      pathname.endsWith('.gif') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.svg') ||
      url.hostname.includes('giphy.com') ||
      url.hostname.includes('tenor.com')
    );
  } catch (_) {
    return false;
  }
};

const renderClickableText = (text: string, isMe: boolean, containsTibetan: boolean) => {
  const parts = text.split(URL_REGEX);
  return (
    <p className={`whitespace-pre-line leading-relaxed ${containsTibetan ? 'font-tibetan' : ''}`}>
      {parts.map((part, i) => {
        if (part.match(URL_REGEX)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline break-all transition font-normal text-[11px] ${
                isMe ? 'text-white hover:text-white/80' : 'text-brand hover:text-brand-hover'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </p>
  );
};

interface LinkPreviewCardProps {
  url: string;
}

export function LinkPreviewCard({ url }: LinkPreviewCardProps) {
  const [metadata, setMetadata] = useState<{
    title?: string;
    description?: string;
    image?: string;
    logo?: string;
    publisher?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const json = await response.json();
        if (json.status === 'success' && active) {
          const data = json.data;
          setMetadata({
            title: data.title,
            description: data.description,
            image: data.image?.url,
            logo: data.logo?.url,
            publisher: data.publisher
          });
        }
      } catch (err) {
        console.error("Failed to fetch link preview metadata:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMetadata();
    return () => {
      active = false;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="mt-2 p-2 bg-muted/20 border border-muted/20 rounded-xl flex items-center gap-2 w-64 md:w-72 select-none animate-pulse">
        <div className="w-8 h-8 rounded bg-muted/40 shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3 bg-muted/40 rounded w-3/4" />
          <div className="h-2.5 bg-muted/40 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!metadata || (!metadata.title && !metadata.description)) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2.5 flex flex-col md:flex-row bg-muted/30 hover:bg-muted/50 border border-muted/20 rounded-xl overflow-hidden max-w-[320px] md:max-w-[380px] transition duration-200 text-left cursor-pointer select-none group"
      onClick={(e) => e.stopPropagation()}
    >
      {metadata.image && (
        <div className="w-full md:w-28 h-20 md:h-full relative shrink-0 overflow-hidden bg-muted/20 border-b md:border-b-0 md:border-r border-muted/20">
          <img
            src={metadata.image}
            alt="Link Preview"
            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
          />
        </div>
      )}

      <div className="p-2.5 flex-1 min-w-0 flex flex-col justify-center gap-1 leading-tight">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          {metadata.logo && (
            <img src={metadata.logo} alt="logo" className="w-3 h-3 object-contain rounded-xs" />
          )}
          <span className="truncate">{metadata.publisher || new URL(url).hostname}</span>
        </div>

        {metadata.title && (
          <h5 className="text-[11px] font-bold text-foreground truncate group-hover:text-brand transition">
            {metadata.title}
          </h5>
        )}

        {metadata.description && (
          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
            {metadata.description}
          </p>
        )}
      </div>
    </a>
  );
}

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
  onSendMediaMessage?: (file: File, isVoice?: boolean) => Promise<void>;
  onConnectChat?: (contactId: string) => void;
  currentUserId?: string;
  profileSettings?: ProfileSettings;
  onShareContactCard?: (cardData: any) => Promise<void> | void;
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
  onLeaveRoom,
  onSendMediaMessage,
  onConnectChat,
  currentUserId,
  profileSettings,
  onShareContactCard
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRoomDetails, setShowRoomDetails] = useState<boolean>(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // --- CHAT IMPROVEMENT STATES ---
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiSearchText, setEmojiSearchText] = useState('');
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isContactCardModalOpen, setIsContactCardModalOpen] = useState(false);
  const [shareName, setShareName] = useState(true);
  const [shareRole, setShareRole] = useState(true);
  const [shareEmail, setShareEmail] = useState(false);
  const [sharePhone, setSharePhone] = useState(false);

  const handleShareCard = async () => {
    if (!onShareContactCard || !profileSettings) return;
    try {
      await onShareContactCard({
        username: shareName ? profileSettings.username : undefined,
        role: shareRole ? profileSettings.role : undefined,
        email: shareEmail ? profileSettings.email : undefined,
        phone: sharePhone ? profileSettings.phone : undefined,
        avatarUrl: profileSettings.avatarUrl
      });
      setIsContactCardModalOpen(false);
    } catch (err) {
      console.error("Failed to share card from chat view:", err);
    }
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingDiscardedRef = useRef<boolean>(false);
  
  useEffect(() => {
    console.log("ChatView: FEATURE_FLAGS loaded ->", FEATURE_FLAGS);
  }, []);
  
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mediaDropdownRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editName, setEditName] = useState(activeChat.name);
  const [editTopic, setEditTopic] = useState(activeChat.topic || '');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [inviteId, setInviteId] = useState('');
  const [isInviting, setIsInviting] = useState(false);


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


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  // --- CHAT IMPROVEMENT HANDLERS ---
  
  // Click outside to close pickers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isEmojiPickerOpen && emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setIsEmojiPickerOpen(false);
      }
      if (mediaDropdownOpen && mediaDropdownRef.current && !mediaDropdownRef.current.contains(target)) {
        setMediaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isEmojiPickerOpen, mediaDropdownOpen]);

  // Insert emoji at cursor position
  const insertEmoji = (emoji: string) => {
    const inputEl = document.querySelector('input[placeholder*="message"], input[placeholder*="ཡིག་འཕྲིན་"]') as HTMLInputElement;
    if (!inputEl) {
      onMsgTextChange(msgText + emoji);
      return;
    }
    
    const start = inputEl.selectionStart ?? msgText.length;
    const end = inputEl.selectionEnd ?? msgText.length;
    const textBefore = msgText.substring(0, start);
    const textAfter = msgText.substring(end);
    const newText = textBefore + emoji + textAfter;
    
    onMsgTextChange(newText);
    
    setTimeout(() => {
      inputEl.focus();
      inputEl.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Filter emojis based on search text
  const filteredEmojiCategories = EMOJI_CATEGORIES.map(cat => {
    if (!emojiSearchText.trim()) return cat;
    const filtered = cat.emojis.filter(e => {
      return cat.name.toLowerCase().includes(emojiSearchText.toLowerCase());
    });
    return { ...cat, emojis: filtered.length > 0 ? cat.emojis : [] };
  }).filter(cat => cat.emojis.length > 0);

  // File Upload Handlers
  const maxBytes = 20 * 1024 * 1024; // 20MB

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendMediaMessage) return;

    if (file.size > maxBytes) {
      alert(lang === 'en' ? "File is too large. Max size is 20MB." : "ཡིག་ཆ་ཆེ་དྲགས་འདུག ཆེ་ཤོས་ལ་ 20MB ལས་མི་ཆོག");
      return;
    }
    
    setIsUploading(true);
    try {
      await onSendMediaMessage(file);
    } catch (err) {
      alert(translations[lang].uploadFailed);
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendMediaMessage) return;

    if (file.size > maxBytes) {
      alert(lang === 'en' ? "File is too large. Max size is 20MB." : "ཡིག་ཆ་ཆེ་དྲགས་འདུག ཆེ་ཤོས་ལ་ 20MB ལས་མི་ཆོག");
      return;
    }

    setIsUploading(true);
    try {
      await onSendMediaMessage(file);
    } catch (err) {
      alert(translations[lang].uploadFailed);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Voice recording duration formatter
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Voice Recorder actions
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(lang === 'en' ? "Microphone recording is not supported in this browser." : "སྐད་འཇུག་རྒྱུད་ཁོངས་འདིར་བཀོལ་སྤྱོད་མི་ཐུབ།");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length === 0 || audioBlob.size < 200) {
          return;
        }

        if (recordingDiscardedRef.current) {
          recordingDiscardedRef.current = false;
          return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Voice_Message_${timestamp}.webm`;
        const audioFile = new File([audioBlob], filename, { type: 'audio/webm' });
        
        if (onSendMediaMessage) {
          setIsUploading(true);
          try {
            await onSendMediaMessage(audioFile, true);
          } catch (err) {
            alert(translations[lang].uploadFailed);
          } finally {
            setIsUploading(false);
          }
        }
      };

      recordingDiscardedRef.current = false;
      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Failed to start voice recording:", err);
      alert(lang === 'en' ? "Failed to access microphone. Please check permissions." : "སྐད་ལེན་དབང་ཆ་ལེན་མ་ཐུབ། སྒྲིག་བཀོད་ལ་གཟིགས།");
    }
  };

  const stopAndSendRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const cancelRecording = () => {
    recordingDiscardedRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingDuration(0);
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
        <div className="flex-1 w-full bg-muted/10 overflow-y-auto">
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
                      m.fileUrl ? (
                        <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md border border-muted bg-[#0f172a]/20 cursor-pointer hover:border-brand/40 transition duration-300">
                          <img
                            src={m.fileUrl}
                            alt={m.fileName || "Image"}
                            className="w-full max-h-48 object-cover hover:scale-[1.01] transition duration-300"
                            onClick={() => setLightboxImageUrl(m.fileUrl!)}
                          />
                          <div className="bg-muted p-2 text-[10px] text-muted-foreground flex justify-between items-center gap-2">
                            <span className="truncate max-w-[130px]">{m.fileName}</span>
                            <div className="flex items-center gap-1 shrink-0 select-none">
                              <span className="text-[8px] text-muted-foreground">{m.time}</span>
                              {isMe && <CheckCheck className="h-3.5 w-3.5 text-brand" />}
                            </div>
                          </div>
                        </div>
                      ) : (
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
                      )
                    ) : m.isFile ? (
                      <div className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/60 border border-muted/20 rounded-xl w-64 md:w-72 transition duration-200">
                        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 leading-tight">
                          <span className="text-xs font-semibold text-foreground truncate block" title={m.fileName}>
                            {m.fileName}
                          </span>
                          {m.fileSize && (
                            <span className="text-[9px] text-muted-foreground font-medium mt-0.5 block">
                              {m.fileSize}
                            </span>
                          )}
                        </div>
                        {m.fileUrl && (
                          <a
                            href={m.fileUrl}
                            download={m.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition shrink-0 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ) : m.isContactCard && FEATURE_FLAGS.enableContactCardSharing ? (
                      <div className="w-64 md:w-72 bg-card border border-muted/30 rounded-2xl overflow-hidden shadow-md flex flex-col hover:border-brand/40 transition duration-300">
                        {/* Card Header with gradient background */}
                        <div className="bg-linear-to-r from-brand/15 to-purple-500/5 p-3 flex items-center gap-3 border-b border-muted/15">
                          <Avatar className="h-10 w-10 border border-brand/20 rounded-full shrink-0">
                            {m.contactCardData?.avatarUrl ? (
                              <AvatarImage src={m.contactCardData.avatarUrl} alt={m.contactCardData.username || 'User'} className="object-cover rounded-full" />
                            ) : null}
                            <AvatarFallback className="bg-brand-light text-brand text-xs font-bold rounded-full">
                              {m.contactCardData?.username ? m.contactCardData.username.substring(0, 2).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block text-foreground truncate">
                              {m.contactCardData?.username || (lang === 'en' ? 'User' : 'སྤྱོད་མིང་།')}
                            </span>
                            {m.contactCardData?.role && (
                              <span className="text-[10px] text-muted-foreground block truncate font-medium mt-0.5">
                                {m.contactCardData.role}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body containing contact details with copy buttons */}
                        <div className="p-3 space-y-2.5 bg-muted/10">
                          {m.contactCardData?.email && (
                            <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-2 min-w-0">
                                <Mail className="w-3.5 h-3.5 text-brand shrink-0" />
                                <span className="truncate" title={m.contactCardData.email}>
                                  {m.contactCardData.email}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopy(m.contactCardData!.email!, `email-${idx}`)}
                                className="p-1 hover:bg-muted text-muted-foreground/60 hover:text-muted-foreground rounded transition cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                                title={lang === 'en' ? "Copy to clipboard" : "འདྲ་བཤུས་བྱེད་པ།"}
                              >
                                {copiedField === `email-${idx}` ? (
                                  <Check className="w-3 h-3 text-emerald-500 animate-success-pop" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          {m.contactCardData?.phone && (
                            <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-2 min-w-0">
                                <Phone className="w-3.5 h-3.5 text-brand shrink-0" />
                                <span className="truncate">{m.contactCardData.phone}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(m.contactCardData!.phone!, `phone-${idx}`)}
                                className="p-1 hover:bg-muted text-muted-foreground/60 hover:text-muted-foreground rounded transition cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                                title={lang === 'en' ? "Copy to clipboard" : "འདྲ་བཤུས་བྱེད་པ།"}
                              >
                                {copiedField === `phone-${idx}` ? (
                                  <Check className="w-3 h-3 text-emerald-500 animate-success-pop" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground/60 font-mono">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[9px] shrink-0 font-sans font-semibold select-none">ID</span>
                              <span className="truncate select-all">{m.contactCardData?.userId}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(m.contactCardData!.userId, `id-${idx}`)}
                              className="p-1 hover:bg-muted text-muted-foreground/60 hover:text-muted-foreground rounded transition cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                              title={lang === 'en' ? "Copy to clipboard" : "འདྲ་བཤུས་བྱེད་པ།"}
                            >
                              {copiedField === `id-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-500 animate-success-pop" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Card Footer / DM message action */}
                        {m.contactCardData?.userId !== currentUserId && onConnectChat ? (
                          <div className="px-3 pb-3 bg-muted/10">
                            <button
                              onClick={() => onConnectChat(m.contactCardData!.userId)}
                              className="w-full h-8 bg-brand hover:bg-brand/90 text-brand-foreground text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer border-none shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>{translations[lang].messageUser}</span>
                            </button>
                          </div>
                        ) : (
                          m.contactCardData?.userId === currentUserId && (
                            <div className="px-3 pb-3 bg-muted/10 text-center">
                              <span className="text-[9px] text-muted-foreground/60 font-semibold bg-muted/30 px-2 py-1 rounded-md block select-none">
                                {lang === 'en' ? 'Your Contact Card' : 'ང་ཡི་འབྲེལ་གཏུག་བྱང་བུ།'}
                              </span>
                            </div>
                          )
                        )}

                        {/* Metadata bar with card source and timestamp */}
                        <div className="bg-muted/10 px-3 pb-2 flex justify-between items-center select-none text-[8px] text-muted-foreground/50 border-t border-muted/5">
                          <span className="font-semibold uppercase tracking-wider text-[7.5px] text-brand/60 flex items-center gap-0.5">
                            <Users className="w-2.5 h-2.5" />
                            {translations[lang].contactCard}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span>{m.time}</span>
                            {isMe && <CheckCheck className="h-3 w-3 text-brand" />}
                          </div>
                        </div>
                      </div>
                    ) : m.isAudio ? (
                      m.fileUrl ? (
                        <CustomAudioPlayer src={m.fileUrl} lang={lang} />
                      ) : null
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

                        {(() => {
                          const urls = detectUrls(m.text);
                          const firstUrl = urls[0];
                          const hasImagePreview = FEATURE_FLAGS.enableLinkPreviews && firstUrl && isImageOrGifUrl(firstUrl);
                          const hasLinkPreview = FEATURE_FLAGS.enableLinkPreviews && firstUrl && !hasImagePreview;

                          return (
                            <>
                              {renderClickableText(m.text, isMe, containsTibetan(m.text))}

                              {/* Image/GIF URL Preview */}
                              {hasImagePreview && (
                                <div className="mt-2 w-full max-w-[280px] rounded-xl overflow-hidden border border-muted bg-[#0f172a]/10 cursor-pointer shadow-xs">
                                  <img
                                    src={firstUrl}
                                    alt="GIF Preview"
                                    className="w-full max-h-48 object-cover hover:scale-[1.01] transition duration-300"
                                    onClick={() => setLightboxImageUrl(firstUrl)}
                                  />
                                </div>
                              )}

                              {/* Rich Link Preview Card */}
                              {hasLinkPreview && (
                                <LinkPreviewCard url={firstUrl} />
                              )}
                            </>
                          );
                        })()}

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
        </div>

        {/* Input Section */}
        <div className="p-3 border-t bg-card flex flex-col relative shrink-0">
          
          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-x-0 bottom-full px-4 py-2.5 bg-card/95 backdrop-blur-md border-t border-muted/20 flex items-center gap-2.5 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <svg className="animate-spin h-3.5 w-3.5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-[10px] font-semibold text-muted-foreground animate-pulse">
                {translations[lang].uploading}
              </span>
            </div>
          )}

          {/* Emoji Picker Popover */}
          {FEATURE_FLAGS.enableEmojiPicker && isEmojiPickerOpen && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16 right-3 z-50 w-72 h-80 bg-card/95 border border-muted/30 shadow-2xl rounded-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-200"
            >
              <div className="p-2 border-b border-muted/20">
                <input
                  type="text"
                  placeholder={translations[lang].emojiSearch}
                  value={emojiSearchText}
                  onChange={(e) => setEmojiSearchText(e.target.value)}
                  className="w-full px-2.5 py-1 text-[11px] bg-muted/65 dark:bg-muted/40 text-foreground border-none rounded-lg outline-none focus:ring-1 focus:ring-brand/50"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {filteredEmojiCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="mb-3">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase px-1 block mb-1">
                      {lang === 'bo' ? translations[lang][`emoji${cat.name}` as keyof typeof translations.bo] : translations[lang][`emoji${cat.name}` as keyof typeof translations.en]}
                    </span>
                    <div className="grid grid-cols-8 gap-1">
                      {cat.emojis.map((emoji, emoIdx) => (
                        <button
                          key={emoIdx}
                          onClick={() => insertEmoji(emoji)}
                          className="h-7 w-7 flex items-center justify-center text-base rounded-md hover:bg-muted hover:scale-110 active:scale-95 transition cursor-pointer border-none bg-transparent"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-9 border-t border-muted/20 flex items-center justify-around bg-muted/20 shrink-0">
                {EMOJI_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEmojiSearchText('');
                      const pickerGrid = emojiPickerRef.current?.querySelector('.scrollbar-thin');
                      if (pickerGrid) {
                        const headers = pickerGrid.querySelectorAll('span');
                        if (headers[idx]) {
                          headers[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="p-1 hover:bg-muted rounded-md transition text-sm cursor-pointer border-none bg-transparent"
                    title={cat.name}
                  >
                    {cat.icon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Attachments Dropdown Menu */}
          {mediaDropdownOpen && (
            <div
              ref={mediaDropdownRef}
              className="absolute bottom-16 left-3 z-50 w-48 bg-card/95 border border-muted/30 shadow-xl rounded-xl p-1.5 flex flex-col gap-1 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-150"
            >
              {FEATURE_FLAGS.enableMediaAttachments && (
                <>
                  <button
                    onClick={() => {
                      setMediaDropdownOpen(false);
                      imageInputRef.current?.click();
                    }}
                    className="w-full px-2.5 py-1.5 hover:bg-muted text-xs font-semibold rounded-lg text-left transition flex items-center gap-2 text-foreground cursor-pointer border-none bg-transparent"
                  >
                    <Image className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{lang === 'en' ? 'Upload Image / Video' : 'པར་དང་བརྙན་ལེན།'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMediaDropdownOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-2.5 py-1.5 hover:bg-muted text-xs font-semibold rounded-lg text-left transition flex items-center gap-2 text-foreground cursor-pointer border-none bg-transparent"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{lang === 'en' ? 'Upload Document' : 'ཡིག་ཆ་སྦྲག་རྒྱུ།'}</span>
                  </button>
                </>
              )}
              {FEATURE_FLAGS.enableContactCardSharing && (
                <button
                  onClick={() => {
                    setMediaDropdownOpen(false);
                    setIsContactCardModalOpen(true);
                  }}
                  className="w-full px-2.5 py-1.5 hover:bg-muted text-xs font-semibold rounded-lg text-left transition flex items-center gap-2 text-foreground cursor-pointer border-none bg-transparent"
                >
                  <Users className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>{lang === 'en' ? 'Share Contact Card' : 'འབྲེལ་གཏུག་བྱང་བུ་བགོ་སྐལ།'}</span>
                </button>
              )}
            </div>
          )}

          {/* Core Input Row */}
          <div className="flex items-center gap-1.5 w-full">
            {(FEATURE_FLAGS.enableMediaAttachments || FEATURE_FLAGS.enableContactCardSharing) && (
              <button
                onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
                className={`p-1.5 rounded-full transition cursor-pointer border-none bg-transparent shrink-0 ${mediaDropdownOpen ? 'bg-brand/10 text-brand' : 'text-muted-foreground hover:text-brand hover:bg-muted'}`}
                title={lang === 'en' ? "Attach assets" : "ཡིག་ཆ་སྦྲག་རྒྱུ།"}
                disabled={isRecording}
              >
                <Plus className="h-5 w-5" />
              </button>
            )}

            {isRecording ? (
              <div className="flex-1 bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono text-rose-500 font-bold select-none">
                    {translations[lang].recording} ({formatDuration(recordingDuration)})
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-0.5 px-3">
                  <span className="w-0.5 h-3 bg-rose-500/45 rounded-full animate-bounce shrink-0 [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-4 bg-rose-500/65 rounded-full animate-bounce shrink-0 [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-2 bg-rose-500/85 rounded-full animate-bounce shrink-0" />
                  <span className="w-0.5 h-5 bg-rose-500 rounded-full animate-bounce shrink-0 [animation-delay:-0.4s]" />
                  <span className="w-0.5 h-3 bg-rose-500/65 rounded-full animate-bounce shrink-0 [animation-delay:-0.2s]" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelRecording}
                    className="p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition active:scale-90 cursor-pointer border-none bg-transparent"
                    title={lang === 'en' ? "Cancel recording" : "སྐད་འཇུག་ཕྱིར་འཐེན།"}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={stopAndSendRecording}
                    className="p-1.5 bg-rose-500 text-white hover:bg-rose-600 rounded-full transition active:scale-90 shadow-sm cursor-pointer border-none"
                    title={lang === 'en' ? "Send voice message" : "སྐད་འཕྲིན་གཏོང་བ།"}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-muted/60 dark:bg-muted/30 rounded-xl px-3 py-1.5 flex items-center justify-between border border-transparent focus-within:border-brand/40 transition duration-150">
                <input
                  type="text"
                  placeholder={translations[lang].typeMessage}
                  value={msgText}
                  onChange={(e) => onMsgTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 bg-transparent text-xs outline-none p-0.5 max-h-12 border-none focus:ring-0 text-foreground ${containsTibetan(msgText) ? 'font-tibetan' : ''}`}
                />
                
                <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                  {FEATURE_FLAGS.enableEmojiPicker && (
                    <button
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className={`text-muted-foreground hover:text-foreground transition p-0.5 cursor-pointer border-none bg-transparent ${isEmojiPickerOpen ? 'text-brand' : ''}`}
                      title={lang === 'en' ? "Add emoji" : "མཚོན་རྟགས་སྦྲག་རྒྱུ།"}
                    >
                      <Smile className="h-4.5 w-4.5" />
                    </button>
                  )}
                  
                  {FEATURE_FLAGS.enableVoiceMessages && onSendMediaMessage && (
                    <button
                      onClick={startRecording}
                      className="text-muted-foreground hover:text-brand transition p-0.5 cursor-pointer border-none bg-transparent"
                      title={lang === 'en' ? "Record voice message" : "སྐད་འཕྲིན་སྐད་འཇུག"}
                    >
                      <Mic className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isRecording && (
              <button
                onClick={onSendMessage}
                disabled={!msgText.trim()}
                className={`p-2 rounded-full shrink-0 transition shadow-sm active:scale-95 border-none cursor-pointer ${msgText.trim()
                  ? 'bg-brand hover:bg-brand-hover text-brand-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                title={lang === 'en' ? "Send message" : "ཡིག་འཕྲིན་གཏོང་རྒྱུ།"}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="*/*"
            className="hidden"
          />
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
          <div className="flex-1 bg-muted/5 overflow-y-auto">
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
          </div>

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

      {/* Fullscreen Lightbox for images */}
      {lightboxImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setLightboxImageUrl(null)}>
          <div className="absolute top-4 right-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <a
              href={lightboxImageUrl}
              download="downloaded_image"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition flex items-center justify-center cursor-pointer shadow-md"
              title={lang === 'en' ? "Download Image" : "པར་འདྲེན་ལེན།"}
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition flex items-center justify-center cursor-pointer shadow-md border-none"
              title={lang === 'en' ? "Close" : "སྒོ་རྒྱག"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <img
            src={lightboxImageUrl}
            alt="Fullscreen Preview"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Share Contact Card Modal */}
      {isContactCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsContactCardModalOpen(false)}>
          <div 
            className="bg-card border border-muted/50 rounded-2xl shadow-xl flex flex-col max-w-sm mx-auto w-full overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center bg-card">
              <h4 className="font-bold text-xs">
                {lang === 'en' ? 'Share My Contact Card' : 'ང་ཡི་འབྲེལ་གཏུག་བྱང་བུ་བགོ་སྐལ།'}
              </h4>
              <button
                onClick={() => setIsContactCardModalOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition text-muted-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 space-y-3 bg-muted/5">
              <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                {lang === 'en' 
                  ? 'Select which information coordinates to include in your contact card before sharing.' 
                  : 'བགོ་སྐལ་མ་བྱས་གོང་འབྲེལ་གཏུག་བྱང་བུའི་ནང་དོན་འདེམས་དགོས།'}
              </p>

              {/* Live Preview Card containing toggles inside */}
              <div className="border border-muted/30 rounded-xl bg-card overflow-hidden shadow-xs flex flex-col mt-2 select-none">
                {/* Header info (Name and Role) */}
                <div className="bg-linear-to-r from-brand/15 to-purple-500/5 p-3 flex items-center justify-between border-b border-muted/15">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="h-9 w-9 border border-brand/20 rounded-full shrink-0">
                      {profileSettings?.avatarUrl ? (
                        <AvatarImage src={profileSettings.avatarUrl} alt="Avatar" className="object-cover rounded-full" />
                      ) : null}
                      <AvatarFallback className="bg-brand-light text-brand text-xs font-bold rounded-full">
                        {profileSettings?.username ? profileSettings.username.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block transition duration-200 truncate ${shareName ? 'text-foreground' : 'text-muted-foreground/30 line-through'}`}>
                        {profileSettings?.username || 'User'}
                      </span>
                      {profileSettings?.role && (
                        <span className={`text-[10px] block transition duration-200 truncate ${shareRole ? 'text-muted-foreground' : 'text-muted-foreground/20 line-through'}`}>
                          {profileSettings.role}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Right-aligned toggles for Name and Role */}
                  <div className="flex flex-col gap-1 items-end justify-center shrink-0 border-l border-muted/10 pl-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground cursor-pointer select-none">
                      <span>{lang === 'en' ? 'Name' : 'མིང་།'}</span>
                      <input
                        type="checkbox"
                        checked={shareName}
                        onChange={(e) => setShareName(e.target.checked)}
                        className="rounded border-muted-foreground/30 text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground cursor-pointer select-none">
                      <span>{lang === 'en' ? 'Title' : 'ལས་གནས།'}</span>
                      <input
                        type="checkbox"
                        checked={shareRole}
                        onChange={(e) => setShareRole(e.target.checked)}
                        className="rounded border-muted-foreground/30 text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Details Section (Email, Phone, and Matrix ID) */}
                <div className="p-3 space-y-2.5 bg-muted/10">
                  {/* Email row with right-aligned toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex items-center gap-2 text-[11px] min-w-0 transition duration-200 ${shareEmail ? 'text-muted-foreground font-medium' : 'text-muted-foreground/20 line-through font-normal'}`}>
                      <Mail className={`w-3.5 h-3.5 shrink-0 transition-colors ${shareEmail ? 'text-brand' : 'text-muted-foreground/20'}`} />
                      <span className="truncate" title={profileSettings?.email || 'no-email@workspace.org'}>
                        {profileSettings?.email || 'no-email@workspace.org'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={shareEmail}
                      onChange={(e) => setShareEmail(e.target.checked)}
                      className="rounded border-muted-foreground/30 text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Phone row with right-aligned toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex items-center gap-2 text-[11px] min-w-0 transition duration-200 ${sharePhone ? 'text-muted-foreground font-medium' : 'text-muted-foreground/20 line-through font-normal'}`}>
                      <Phone className={`w-3.5 h-3.5 shrink-0 transition-colors ${sharePhone ? 'text-brand' : 'text-muted-foreground/20'}`} />
                      <span className="truncate">
                        {profileSettings?.phone || '+0 000 000 0000'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={sharePhone}
                      onChange={(e) => setSharePhone(e.target.checked)}
                      className="rounded border-muted-foreground/30 text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Matrix ID row (Static, read-only context helper) */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 font-mono border-t border-muted/5 pt-2 select-all">
                    <span className="bg-muted px-1.5 py-0.5 rounded text-[8px] font-sans font-bold select-none text-muted-foreground/70">ID</span>
                    <span className="truncate">{currentUserId || '@user:im.tibcert.org'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-muted/10 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsContactCardModalOpen(false)}
                className="px-3 h-8 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition cursor-pointer border-none bg-transparent"
              >
                {lang === 'en' ? 'Cancel' : 'ཕྱིར་འཐེན།'}
              </button>
              <button
                onClick={handleShareCard}
                className="px-4 h-8 bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer border-none shadow-sm"
              >
                {lang === 'en' ? 'Share' : 'བགོ་སྐལ་བྱ།'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
