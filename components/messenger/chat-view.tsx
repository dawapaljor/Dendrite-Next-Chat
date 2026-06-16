'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  MessageSquare,
  CornerUpLeft,
  CornerUpRight,
  Undo2,
  Edit2,
  AtSign,
  Forward,
  Reply,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChatThread, Message, ProfileSettings, Contact } from "./types";
import { translations, Language, TranslationKey } from "@/lib/translations";
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
                className={`w-[3px] rounded-full transition duration-150 shrink-0 ${isLit ? 'bg-brand' : 'bg-muted-foreground/30'
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
            {translations[lang].voiceLabel}
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

const parseInlineStyles = (text: string, isMe: boolean) => {
  const TOKEN_REGEX = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
            isMe 
              ? 'bg-white/20 text-rose-200 border border-white/10' 
              : 'bg-muted border border-muted-foreground/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const parseTextFormatting = (text: string, isMe: boolean, containsTibetan: boolean, members: Contact[] = []) => {
  const MENTION_REGEX = /(@[^\s@]+)/g;
  const parts = text.split(MENTION_REGEX);

  return parts.map((part, idx) => {
    if (part.match(MENTION_REGEX)) {
      const nameWithoutAt = part.substring(1);
      const isMember = members.some(m => m.name === nameWithoutAt || m.id === part);
      if (isMember) {
        return (
          <span
            key={idx}
            className={`font-semibold rounded px-1 py-0.5 select-all ${isMe
              ? 'bg-white/20 text-white border border-white/10'
              : 'bg-brand/10 text-brand border border-brand/5'}`}
          >
            {part}
          </span>
        );
      }
    }
    return <React.Fragment key={idx}>{parseInlineStyles(part, isMe)}</React.Fragment>;
  });
};

const renderInlineMarkdown = (text: string, isMe: boolean, containsTibetan: boolean, members: Contact[] = []) => {
  const parts = text.split(URL_REGEX);

  return parts.map((part, i) => {
    if (part.match(URL_REGEX)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline break-all transition font-normal text-[11px] ${isMe ? 'text-white hover:text-white/80' : 'text-brand hover:text-brand-hover'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{parseTextFormatting(part, isMe, containsTibetan, members)}</React.Fragment>;
  });
};

const renderMarkdownText = (text: string, isMe: boolean, containsTibetan: boolean, members: Contact[] = []) => {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const startIndex = match.index;
    if (startIndex > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, startIndex) });
    }
    parts.push({ type: 'codeblock', lang: match[1], content: match[2] });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return (
    <div className={`whitespace-pre-line leading-relaxed ${containsTibetan ? 'font-tibetan' : ''} space-y-1.5`}>
      {parts.map((part, index) => {
        if (part.type === 'codeblock') {
          return (
            <div key={index} className="my-1.5 rounded-lg overflow-hidden border border-muted/50 bg-[#0f172a] text-slate-100 font-mono text-[10px] w-full max-w-full">
              <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-slate-400 select-none">
                <span className="text-[9px] uppercase font-bold tracking-wider">{part.lang || 'code'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(part.content);
                  }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition flex items-center justify-center border-none bg-transparent cursor-pointer"
                  title="Copy code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="p-3 overflow-x-auto leading-relaxed select-text">
                <code>{part.content.trim()}</code>
              </pre>
            </div>
          );
        }

        return (
          <span key={index} className="inline-block w-full">
            {renderInlineMarkdown(part.content, isMe, containsTibetan, members)}
          </span>
        );
      })}
    </div>
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
      <div className="mt-2 bg-muted/20 border border-muted/20 rounded-xl overflow-hidden w-full max-w-[340px] md:max-w-[400px] select-none animate-pulse">
        <div className="w-full h-[180px] bg-muted/40" />
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-muted/40 shrink-0" />
            <div className="h-2.5 bg-muted/40 rounded w-20" />
          </div>
          <div className="h-3.5 bg-muted/40 rounded w-4/5" />
          <div className="h-2.5 bg-muted/40 rounded w-3/5" />
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
      className="mt-2.5 flex flex-col bg-muted/30 hover:bg-muted/50 border border-muted/20 rounded-xl overflow-hidden w-full max-w-[340px] md:max-w-[400px] transition duration-200 text-left cursor-pointer select-none group"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Full-width hero image */}
      {metadata.image && (
        <div className="w-full h-[180px] relative shrink-0 overflow-hidden bg-muted/20">
          <img
            src={metadata.image}
            alt="Link Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}

      {/* Metadata section */}
      <div className="px-3 py-2.5 flex-1 min-w-0 flex flex-col justify-center gap-1 leading-tight">
        {/* Publisher row with logo */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {metadata.logo && (
            <img src={metadata.logo} alt="logo" className="w-4 h-4 object-contain rounded-full" />
          )}
          <span className="truncate">{metadata.publisher || new URL(url).hostname}</span>
        </div>

        {/* Title */}
        {metadata.title && (
          <h5 className="text-[12.5px] font-bold text-foreground line-clamp-2 leading-snug group-hover:text-brand transition">
            {metadata.title}
          </h5>
        )}

        {/* Description */}
        {metadata.description && (
          <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-snug">
            {metadata.description}
          </p>
        )}
      </div>
    </a>
  );
}

interface EphemeralMessageCountdownProps {
  messageId: string;
  expiresAt: number;
  isMe: boolean;
  onExpired: () => void;
  lang: string;
}

function EphemeralMessageCountdown({ messageId, expiresAt, isMe, onExpired, lang }: EphemeralMessageCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpired();
      return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, timeLeft, onExpired]);

  if (timeLeft <= 0) return null;

  const formatTimeLeft = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className={`flex items-center gap-1 text-[8px] font-mono select-none px-1 py-0.5 rounded mt-1 border shrink-0 ${
      isMe 
        ? 'text-rose-200/90 border-white/10 bg-white/10' 
        : 'text-rose-500 border-rose-500/10 bg-rose-500/5'
    }`}>
      <span className="animate-pulse">🔥</span>
      <span>{translations[lang].remainingTime.replace('{time}', formatTimeLeft(timeLeft))}</span>
    </div>
  );
}

interface ChatViewProps {
  activeChat: ChatThread;
  msgText: string;
  onMsgTextChange: (val: string) => void;
  onSendMessage: (replyToId?: string, ttl?: number) => void;
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
  chats?: ChatThread[];
  onEditMessage?: (eventId: string, newText: string) => Promise<void>;
  onRecallMessage?: (eventId: string) => Promise<void>;
  onForwardMessage?: (targetRoomId: string, messageText: string, originalSender: string) => Promise<void>;
  onSendReaction?: (messageId: string, emoji: string) => Promise<void> | void;
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
  onShareContactCard,
  chats,
  onEditMessage,
  onRecallMessage,
  onForwardMessage,
  onSendReaction
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

  // --- ADVANCED FEATURE STATES ---
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ eventId: string; text: string } | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [forwardSearchQuery, setForwardSearchQuery] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // --- E2EE & EPHEMERAL STATES ---
  const [ephemeralTtl, setEphemeralTtl] = useState<number>(0);
  const [burnedMessageIds, setBurnedMessageIds] = useState<Record<string, boolean>>({});

  // --- POLISH & INTERACTION STATES ---
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const handleScrollToMessage = useCallback((msgId: string) => {
    const element = document.getElementById(`msg-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(msgId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  }, []);

  const handleExpired = useCallback((msgId: string, isMe: boolean) => {
    setBurnedMessageIds(prev => ({ ...prev, [msgId]: true }));
    if (isMe && onRecallMessage) {
      onRecallMessage(msgId);
    }
  }, [onRecallMessage]);

  // Mention autocomplete
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionResults, setMentionResults] = useState<Contact[]>([]);
  const [mentionStartIdx, setMentionStartIdx] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Link preview compose state
  const [composeUrl, setComposeUrl] = useState<string | null>(null);
  const [dismissedUrl, setDismissedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!FEATURE_FLAGS.enableLinkPreviews) {
      setComposeUrl(null);
      return;
    }
    const urls = detectUrls(msgText);
    const firstUrl = urls[0] || null;

    if (!firstUrl) {
      setComposeUrl(null);
      setDismissedUrl(null);
    } else if (firstUrl !== dismissedUrl) {
      setComposeUrl(firstUrl);
    } else {
      setComposeUrl(null);
    }
  }, [msgText, dismissedUrl]);

  useEffect(() => {
    setComposeUrl(null);
    setDismissedUrl(null);
  }, [activeChat.id]);

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
      alert(translations[lang].failedSaveRoomDetails);
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
      alert(translations[lang].failedInviteUser + (err?.message || 'Unknown'));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUserAction = async (memberId: string) => {
    if (!onRemoveUser) return;
    if (confirm(translations[lang].confirmRemoveMember)) {
      try {
        await onRemoveUser(activeChat.id, memberId);
      } catch (err: any) {
        alert(translations[lang].failedRemoveUser + (err?.message || 'Unknown'));
      }
    }
  };

  const handleLeaveRoomAction = async () => {
    if (!onLeaveRoom) return;
    const confirmMsg = activeChat.isAdmin
      ? translations[lang].confirmDestroyRoom
      : translations[lang].confirmLeaveRoom;

    if (confirm(confirmMsg)) {
      try {
        await onLeaveRoom(activeChat.id);
        setShowRoomDetails(false);
      } catch (err: any) {
        alert(translations[lang].failedLeaveRoom + (err?.message || 'Unknown'));
      }
    }
  };

  useEffect(() => {
    // Auto Scroll to Bottom on message change
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, isTyping]);

  // Reset reply/edit state when active chat changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setReplyTo(null);
      setEditingMessage(null);
      setForwardingMessage(null);
      setMentionQuery(null);
      setMentionResults([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeChat.id]);

  // Mention autocomplete: watch msgText for @ trigger
  useEffect(() => {
    const cursor = inputRef.current?.selectionStart ?? msgText.length;
    const textBeforeCursor = msgText.slice(0, cursor);
    const atMatch = textBeforeCursor.match(/@([\w\u0F00-\u0FFF]*)$/);
    if (atMatch) {
      const query = atMatch[1].toLowerCase();
      setMentionQuery(query);
      setMentionStartIdx(textBeforeCursor.lastIndexOf('@'));
      const members = activeChat.members || [];
      const results = members.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query)
      ).slice(0, 6);
      setMentionResults(results);
    } else {
      setMentionQuery(null);
      setMentionResults([]);
    }
  }, [msgText, activeChat.members]);

  const insertMention = (member: Contact) => {
    const before = msgText.slice(0, mentionStartIdx);
    const after = msgText.slice(inputRef.current?.selectionStart ?? msgText.length);
    const newText = `${before}@${member.name} ${after}`;
    onMsgTextChange(newText);
    setMentionQuery(null);
    setMentionResults([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionResults.length > 0 && (e.key === 'Escape')) {
      setMentionQuery(null);
      setMentionResults([]);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendOrEdit();
    }
  };

  const handleSendOrEdit = async () => {
    if (editingMessage) {
      if (!msgText.trim() || !onEditMessage) return;
      setIsSubmittingAction(true);
      try {
        await onEditMessage(editingMessage.eventId, msgText.trim());
        setEditingMessage(null);
        onMsgTextChange('');
      } catch (err) {
        console.error('Failed to edit message:', err);
      } finally {
        setIsSubmittingAction(false);
      }
    } else {
      onSendMessage(replyTo?.id, ephemeralTtl);
      setReplyTo(null);
    }
  };

  const handleReply = (msg: Message) => {
    setReplyTo(msg);
    setEditingMessage(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleStartEdit = (msg: Message) => {
    if (!msg.id) return;
    setEditingMessage({ eventId: msg.id, text: msg.text });
    setReplyTo(null);
    onMsgTextChange(msg.text);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRecall = async (msg: Message) => {
    if (!msg.id || !onRecallMessage) return;
    if (!confirm(translations[lang].confirmRemoveMember?.replace('remove this member', 'recall this message') || 'Recall this message?')) return;
    setIsSubmittingAction(true);
    try {
      await onRecallMessage(msg.id);
    } catch (err) {
      console.error('Failed to recall message:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleForward = (msg: Message) => {
    setForwardingMessage(msg);
    setForwardSearchQuery('');
  };

  const handleConfirmForward = async (targetChat: ChatThread) => {
    if (!forwardingMessage || !onForwardMessage) return;
    setIsSubmittingAction(true);
    try {
      await onForwardMessage(targetChat.id, forwardingMessage.text, forwardingMessage.senderName || '');
      setForwardingMessage(null);
    } catch (err) {
      console.error('Failed to forward message:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const cancelReplyOrEdit = () => {
    setReplyTo(null);
    if (editingMessage) {
      setEditingMessage(null);
      onMsgTextChange('');
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
      alert(translations[lang].fileTooLarge);
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
      alert(translations[lang].fileTooLarge);
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
        alert(translations[lang].micNotSupported);
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
      alert(translations[lang].micAccessFailed);
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

  const renderMessageDropdown = (msg: Message, isMe: boolean) => {
    return (
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-150 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="p-0.5 rounded-full bg-black/25 hover:bg-black/45 text-white transition-colors duration-150 border-none cursor-pointer flex items-center justify-center shadow-xs">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          } />
          <DropdownMenuContent align={isMe ? "end" : "start"} className="min-w-[100px] text-[11px] py-1 bg-card border border-muted/50 rounded-lg shadow-md z-50">
            <DropdownMenuItem
              onClick={() => handleReply(msg)}
              className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted text-foreground cursor-pointer"
            >
              <Reply className="w-3 h-3 text-muted-foreground" />
              <span>{translations[lang].reply}</span>
            </DropdownMenuItem>
            {onForwardMessage && (
              <DropdownMenuItem
                onClick={() => handleForward(msg)}
                className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted text-foreground cursor-pointer"
              >
                <Forward className="w-3 h-3 text-muted-foreground" />
                <span>{translations[lang].forward}</span>
              </DropdownMenuItem>
            )}
            {isMe && onEditMessage && !msg.isImage && !msg.isFile && !msg.isAudio && (
              <DropdownMenuItem
                onClick={() => handleStartEdit(msg)}
                className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted text-foreground cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-muted-foreground" />
                <span>{translations[lang].edit}</span>
              </DropdownMenuItem>
            )}
            {isMe && onRecallMessage && (
              <DropdownMenuItem
                onClick={() => handleRecall(msg)}
                className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted text-rose-500 focus:text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>{translations[lang].recall}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const renderFloatingReactions = (msg: Message, isMe: boolean) => {
    if (!onSendReaction || !msg.id) return null;
    const popularEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    
    return (
      <div className={`absolute -top-7 ${isMe ? 'left-2' : 'right-2'} opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 z-30 flex items-center gap-1 bg-card border border-muted/80 px-2 py-0.5 rounded-full shadow-md scale-90 group-hover/bubble:scale-100`}>
        {popularEmojis.map((emoji) => {
          const userReaction = msg.reactions?.find(r => r.emoji === emoji);
          const hasReacted = !!userReaction?.userReacted;
          const reactionEventId = userReaction?.userReactionEventId;

          return (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                if (hasReacted && reactionEventId && onRecallMessage) {
                  onRecallMessage(reactionEventId);
                } else {
                  onSendReaction(msg.id!, emoji);
                }
              }}
              className={`hover:scale-125 hover:rotate-3 transition duration-150 p-0.5 text-xs bg-transparent border-none cursor-pointer filter hover:brightness-110 active:scale-95 ${
                hasReacted ? 'scale-110 bg-brand/10 rounded-full' : ''
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    );
  };

  const renderReactionCapsules = (msg: Message) => {
    if (!msg.reactions || msg.reactions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1 select-none">
        {msg.reactions.map((reaction) => {
          return (
            <button
              key={reaction.emoji}
              onClick={(e) => {
                e.stopPropagation();
                if (reaction.userReacted && reaction.userReactionEventId && onRecallMessage) {
                  onRecallMessage(reaction.userReactionEventId);
                } else if (onSendReaction && msg.id) {
                  onSendReaction(msg.id, reaction.emoji);
                }
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] transition duration-200 cursor-pointer active:scale-95 ${
                reaction.userReacted
                  ? 'bg-brand/10 border-brand/30 text-brand font-semibold shadow-2xs'
                  : 'bg-muted/40 border-muted text-muted-foreground hover:bg-muted/70 hover:border-muted-foreground/20'
              }`}
            >
              <span>{reaction.emoji}</span>
              <span className="text-[9px] font-mono">{reaction.count}</span>
            </button>
          );
        })}
      </div>
    );
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
              <h4 className="font-bold text-xs truncate text-foreground flex items-center gap-1.5">
                {activeChat.isGroup ? (
                  <Hash className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                ) : null}
                <span className="truncate">{activeChat.name}</span>
                {FEATURE_FLAGS.enableSecurityTrustIndicators && activeChat.isEncrypted && (
                  <span className="text-emerald-500 shrink-0 select-none cursor-help" title={translations[lang].encryptedRoom}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                )}
              </h4>
              <span className={`text-[10px] block transition-all duration-300 ${isTyping ? 'text-brand font-medium' : 'text-muted-foreground'}`}>
                {isTyping
                  ? <span className="flex items-center gap-1">
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:-0.3s] inline-block" />
                      <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:-0.15s] inline-block" />
                      <span className="w-1 h-1 rounded-full bg-brand animate-bounce inline-block" />
                    </span>
                    {translations[lang].typing}
                  </span>
                  : activeChat.isGroup
                    ? translations[lang].membersCount.replace('{count}', String(activeChat.members?.length || 0))
                    : (activeChat.online === true ? translations[lang].online : translations[lang].offline)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              className={`p-1.5 hover:bg-muted rounded-full transition ${showRoomDetails ? 'text-brand bg-brand-light text-brand-light-foreground' : 'text-muted-foreground'}`}
              title={translations[lang].roomDetailsTooltip}
            >
              <Users className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-full text-muted-foreground" title={translations[lang].moreOptionsTooltip}>
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream area with custom scroll */}
        <div className="flex-1 w-full bg-muted/10 overflow-y-auto overflow-x-hidden">
          <div className="px-4 py-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[9px] tracking-wide bg-muted text-muted-foreground py-0.5 px-2.5 rounded-full font-semibold uppercase">
                Today
              </span>
            </div>

            {activeChat.messages.map((m, idx) => {
              const isMe = m.sender === 'me';
              const msgKey = m.id || String(idx);
              const isBurned = m.expiresAt ? (Date.now() > m.expiresAt || burnedMessageIds[m.id]) : false;

              // Get initials for fallback
              const initials = m.senderName
                ? m.senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'U';

              // Burned message display
              if (isBurned) {
                return (
                  <div 
                    key={msgKey} 
                    id={m.id ? `msg-${m.id}` : undefined}
                    className={`flex items-end gap-2.5 w-full p-1 rounded-2xl transition-all duration-500 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${
                      highlightedMessageId === m.id ? 'ring-2 ring-brand/60 bg-brand/5 dark:bg-brand/10 scale-[1.01]' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8 border border-muted-foreground/10 shrink-0 rounded-full opacity-40">
                      {m.senderAvatar ? <AvatarImage src={m.senderAvatar} alt={m.senderName || 'User'} className="object-cover rounded-full" /> : null}
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold rounded-full">{initials}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] italic border border-dashed select-none flex items-center gap-1.5 ${
                        isMe 
                          ? 'border-white/20 bg-white/5 text-white/40' 
                          : 'border-muted-foreground/20 bg-muted/10 text-muted-foreground/50'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                        <span>{translations[lang].burnedMessage}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Recalled message display
              if (m.isRecalled) {
                return (
                  <div 
                    key={msgKey} 
                    id={m.id ? `msg-${m.id}` : undefined}
                    className={`flex items-end gap-2.5 w-full p-1 rounded-2xl transition-all duration-500 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${
                      highlightedMessageId === m.id ? 'ring-2 ring-brand/60 bg-brand/5 dark:bg-brand/10 scale-[1.01]' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8 border border-muted-foreground/10 shrink-0 rounded-full opacity-40">
                      {m.senderAvatar ? <AvatarImage src={m.senderAvatar} alt={m.senderName || 'User'} className="object-cover rounded-full" /> : null}
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold rounded-full">{initials}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="px-3 py-1.5 rounded-xl text-[10px] italic text-muted-foreground/60 border border-dashed border-muted/40 bg-muted/10 select-none flex items-center gap-1.5">
                        <Undo2 className="w-3 h-3 shrink-0" />
                        <span>{isMe ? translations[lang].recalledMessageMe : translations[lang].recalledMessagePartner}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msgKey}
                  id={m.id ? `msg-${m.id}` : undefined}
                  className={`flex items-end gap-2.5 w-full p-1 rounded-2xl transition-all duration-500 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${
                    highlightedMessageId === m.id ? 'ring-2 ring-brand/60 bg-brand/5 dark:bg-brand/10 scale-[1.01]' : ''
                  }`}
                >
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
                  <div className={`flex flex-col max-w-[70%] min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Chat Bubble */}
                    {m.isImage ? (
                      m.fileUrl ? (<>
                        <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md border border-muted bg-[#0f172a]/20 cursor-pointer hover:border-brand/40 transition duration-300 relative group/bubble">
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
                          {renderMessageDropdown(m, isMe)}
                          {renderFloatingReactions(m, isMe)}
                        </div>
                        {renderReactionCapsules(m)}
                      </>) : (<>
                        <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md border hover:border-brand/40 transition duration-300 border-muted relative group/bubble">
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
                          {renderMessageDropdown(m, isMe)}
                          {renderFloatingReactions(m, isMe)}
                        </div>
                        {renderReactionCapsules(m)}
                      </>)
                    ) : m.isFile ? (<>
                      <div className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/60 border border-muted/20 rounded-xl w-64 md:w-72 transition duration-200 relative group/bubble">
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
                        {renderMessageDropdown(m, isMe)}
                        {renderFloatingReactions(m, isMe)}
                      </div>
                      {renderReactionCapsules(m)}
                    </>) : m.isContactCard && FEATURE_FLAGS.enableContactCardSharing ? (<>
                      <div className="w-64 md:w-72 bg-card border border-muted/30 rounded-2xl overflow-hidden shadow-md flex flex-col hover:border-brand/40 transition duration-300 relative group/bubble">
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
                              {m.contactCardData?.username || translations[lang].userFallback}
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
                                title={translations[lang].copyToClipboardTooltip}
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
                                title={translations[lang].copyToClipboardTooltip}
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
                              title={translations[lang].copyToClipboardTooltip}
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
                                {translations[lang].yourContactCard}
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
                        {renderMessageDropdown(m, isMe)}
                        {renderFloatingReactions(m, isMe)}
                      </div>
                      {renderReactionCapsules(m)}
                    </>) : m.isAudio ? (
                      m.fileUrl ? (<>
                        <div className="relative group/bubble">
                          <CustomAudioPlayer src={m.fileUrl} lang={lang} />
                          {renderMessageDropdown(m, isMe)}
                          {renderFloatingReactions(m, isMe)}
                        </div>
                        {renderReactionCapsules(m)}
                      </>) : null
                    ) : (<>
                      <div
                        className={`px-2 py-2 rounded-xl text-xs leading-relaxed shadow-xs transition duration-200 flex flex-col relative group/bubble w-full min-w-0 ${isMe
                          ? 'bg-brand text-brand-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                          }`}
                      >
                        {/* Forwarded label */}
                        {m.isForwarded && (
                          <div className={`flex items-center gap-1 text-[9px] mb-1 font-semibold italic select-none ${isMe ? 'text-white/60' : 'text-muted-foreground/60'}`}>
                            <Forward className="w-2.5 h-2.5" />
                            <span>{m.forwardedFrom ? translations[lang].forwardedFrom.replace('{name}', m.forwardedFrom) : translations[lang].forwarded}</span>
                          </div>
                        )}

                        {/* Reply context preview */}
                        {m.replyTo && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (m.replyTo?.id) {
                                handleScrollToMessage(m.replyTo.id);
                              }
                            }}
                            className={`mb-1.5 pl-2 border-l-2 py-0.5 rounded-sm cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150 select-none ${isMe ? 'border-white/40 bg-white/10' : 'border-brand/50 bg-brand/5'}`}
                            title="Go to parent message"
                          >
                            <span className={`text-[9px] font-bold block ${isMe ? 'text-white/70' : 'text-brand'}`}>
                              {m.replyTo.senderName}
                            </span>
                            <span className={`text-[10px] line-clamp-1 ${isMe ? 'text-white/60' : 'text-muted-foreground/70'}`}>
                              {m.replyTo.text}
                            </span>
                          </div>
                        )}

                        {/* Sender Name inside bubble (group chats) */}
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
                              {renderMarkdownText(m.text, isMe, containsTibetan(m.text), activeChat.members)}

                              {/* Image/GIF URL Preview */}
                              {hasImagePreview && (
                                <div className="mt-2 w-full max-w-[280px] rounded-xl overflow-hidden border border-muted bg-[#0f172a]/10 cursor-pointer shadow-xs">
                                  <img
                                    src={firstUrl}
                                    alt="GIF Preview"
                                    className=""
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

                        {/* Time & status + edited badge */}
                        <div className="flex flex-col items-end mt-0.5 shrink-0">
                          <div className={`flex items-center justify-end gap-1 text-[8px] select-none ${isMe ? 'text-white/70' : 'text-muted-foreground/40'}`}>
                            {m.isEdited && (
                              <span className="italic mr-1">{translations[lang].edited}</span>
                            )}
                            <span>{m.time}</span>
                            {isMe && <CheckCheck className="h-3 w-3 text-white" />}
                          </div>
                          {m.expiresAt && !isBurned && (
                            <EphemeralMessageCountdown
                              messageId={m.id}
                              expiresAt={m.expiresAt}
                              isMe={isMe}
                              onExpired={() => handleExpired(m.id, isMe)}
                              lang={lang}
                            />
                          )}
                        </div>
                        {renderMessageDropdown(m, isMe)}
                        {renderFloatingReactions(m, isMe)}
                      </div>
                      {renderReactionCapsules(m)}
                    </>)}
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
                      <span className="text-[10px] italic">{translations[lang].thinking}</span>
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

          {/* Mention Autocomplete Dropdown */}
          {mentionResults.length > 0 && mentionQuery !== null && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-muted/30 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-150">
              {mentionResults.map((member) => (
                <button
                  key={member.id}
                  onClick={() => insertMention(member)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted text-left transition cursor-pointer border-none bg-transparent"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-6 w-6 border border-muted-foreground/10 rounded-full">
                      <AvatarImage src={member.avatar} alt={member.name} className="object-cover rounded-full" />
                      <AvatarFallback className="bg-brand-light text-brand text-[8px] font-bold rounded-full">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ${member.online === true ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-foreground block truncate">{member.name}</span>
                    <span className="text-[9px] text-muted-foreground font-mono truncate block">{member.id}</span>
                  </div>
                  <AtSign className="w-3 h-3 text-brand shrink-0 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {/* Compose URL Preview */}
          {composeUrl && (
            <div className="mb-2 relative w-fit max-w-[340px] md:max-w-[400px] animate-in slide-in-from-bottom-2 fade-in duration-150">
              <LinkPreviewCard url={composeUrl} />
              <button
                onClick={() => setDismissedUrl(composeUrl)}
                className="absolute top-4 right-2.5 p-1 bg-black/60 hover:bg-black/80 rounded-full transition text-white hover:text-white border-none cursor-pointer flex items-center justify-center shadow-md z-30"
                title="Remove preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reply / Edit Preview Banner */}
          {(replyTo || editingMessage) && (
            <div className={`mb-2 flex items-start gap-2 px-3 py-2 rounded-xl border animate-in slide-in-from-bottom-2 fade-in duration-150 ${editingMessage
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-brand/5 border-brand/20'
              }`}>
              <div className="shrink-0 mt-0.5">
                {editingMessage
                  ? <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                  : <Reply className="w-3.5 h-3.5 text-brand" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${editingMessage ? 'text-amber-500' : 'text-brand'
                  }`}>
                  {editingMessage ? translations[lang].editingMessage : `${translations[lang].replyingTo} ${replyTo?.senderName || ''}`}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  {editingMessage ? editingMessage.text : replyTo?.text}
                </span>
              </div>
              <button
                onClick={cancelReplyOrEdit}
                className="p-0.5 hover:bg-muted rounded-full transition text-muted-foreground/60 hover:text-muted-foreground border-none bg-transparent cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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
                      {translations[lang][`emoji${cat.name}` as TranslationKey]}
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
                    <span>{translations[lang].uploadImageVideo}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMediaDropdownOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-2.5 py-1.5 hover:bg-muted text-xs font-semibold rounded-lg text-left transition flex items-center gap-2 text-foreground cursor-pointer border-none bg-transparent"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{translations[lang].uploadDocument}</span>
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
                  <span>{translations[lang].shareContactCard}</span>
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
                title={translations[lang].attachAssetsTooltip}
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
                    title={translations[lang].cancelRecordingTooltip}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={stopAndSendRecording}
                    className="p-1.5 bg-rose-500 text-white hover:bg-rose-600 rounded-full transition active:scale-90 shadow-sm cursor-pointer border-none"
                    title={translations[lang].sendVoiceTooltip}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex-1 rounded-xl px-3 py-1.5 flex items-center justify-between border transition duration-150 ${editingMessage
                  ? 'bg-amber-500/5 border-amber-500/30 focus-within:border-amber-500/50'
                  : 'bg-muted/60 dark:bg-muted/30 border-transparent focus-within:border-brand/40'
                }`}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    editingMessage 
                      ? translations[lang].editingMessage + '...' 
                      : ephemeralTtl > 0 
                        ? `🔥 [Self-destruct: ${ephemeralTtl}s active] ${translations[lang].typeMessage}...`
                        : replyTo 
                          ? `${translations[lang].replyingTo} ${replyTo.senderName}...` 
                          : translations[lang].typeMessage
                  }
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
                      title={translations[lang].addEmojiTooltip}
                    >
                      <Smile className="h-4.5 w-4.5" />
                    </button>
                  )}

                  {FEATURE_FLAGS.enableEphemeralMessages && (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <button
                          className={`text-muted-foreground hover:text-foreground transition p-0.5 cursor-pointer border-none bg-transparent relative ${ephemeralTtl > 0 ? 'text-rose-500 hover:text-rose-600' : ''}`}
                          title={translations[lang].ephemeralTimer}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {ephemeralTtl > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                          )}
                        </button>
                      } />
                      <DropdownMenuContent align="end" className="w-32 bg-card border border-muted z-50 p-1 rounded-xl shadow-lg">
                        <DropdownMenuItem onClick={() => setEphemeralTtl(0)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 0 ? 'text-brand font-semibold' : ''}`}>
                          {translations[lang].ephemeralTimerOff}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEphemeralTtl(10)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 10 ? 'text-brand font-semibold' : ''}`}>
                          10s
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEphemeralTtl(30)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 30 ? 'text-brand font-semibold' : ''}`}>
                          30s
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEphemeralTtl(60)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 60 ? 'text-brand font-semibold' : ''}`}>
                          1m
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEphemeralTtl(300)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 300 ? 'text-brand font-semibold' : ''}`}>
                          5m
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEphemeralTtl(3600)} className={`text-[10px] p-1.5 cursor-pointer rounded-lg ${ephemeralTtl === 3600 ? 'text-brand font-semibold' : ''}`}>
                          1h
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {FEATURE_FLAGS.enableVoiceMessages && onSendMediaMessage && (
                    <button
                      onClick={startRecording}
                      className="text-muted-foreground hover:text-brand transition p-0.5 cursor-pointer border-none bg-transparent"
                      title={translations[lang].recordVoiceTooltip}
                    >
                      <Mic className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isRecording && (
              <button
                onClick={handleSendOrEdit}
                disabled={!msgText.trim() || isSubmittingAction}
                className={`p-2 rounded-full shrink-0 transition shadow-sm active:scale-95 border-none cursor-pointer ${editingMessage
                    ? msgText.trim() ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'
                    : msgText.trim() ? 'bg-brand hover:bg-brand-hover text-brand-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                title={editingMessage ? translations[lang].saveLabel : translations[lang].sendMessageTooltip}
              >
                {editingMessage ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
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
            <h4 className="font-bold text-sm">{translations[lang].roomDetailsHeader}</h4>
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
                      {translations[lang].uploadPhoto}
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Edit Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{translations[lang].roomNameLabel}</label>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xs h-8 bg-card"
                    placeholder={translations[lang].roomNamePlaceholder}
                  />
                </div>

                {/* Edit Topic */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{translations[lang].roomDescriptionLabel}</label>
                  <textarea
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="w-full text-xs p-2 bg-card border border-muted-foreground/15 rounded-md focus:ring-1 focus:ring-brand outline-none text-foreground resize-none h-16"
                    placeholder={translations[lang].roomDescriptionPlaceholder}
                  />
                </div>

                {/* Save/Cancel buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRoomDetails}
                    disabled={isSavingDetails || !editName.trim()}
                    className="flex-1 py-1.5 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingDetails ? translations[lang].saving : translations[lang].saveLabel}
                  </button>
                  <button
                    onClick={() => setIsEditingDetails(false)}
                    disabled={isSavingDetails}
                    className="flex-1 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-muted rounded-lg text-[10px] font-bold transition active:scale-95 cursor-pointer"
                  >
                    {translations[lang].cancel}
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
                  {activeChat.isGroup ? translations[lang].groupChatLabel : translations[lang].directConversationLabel}
                </span>

                {activeChat.topic ? (
                  <div className="text-[11px] text-muted-foreground text-center px-4 mt-3 leading-relaxed break-words border-t border-muted/20 pt-3 w-full">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1">{translations[lang].roomTopicLabel}</span>
                    <p className="text-foreground/90">{activeChat.topic}</p>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground/60 italic text-center mt-3 border-t border-muted/20 pt-3 w-full">
                    {translations[lang].noRoomTopic}
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
                    {translations[lang].editDetailsLabel}
                  </button>
                )}

                {/* Room ID section */}
                <div className="w-full mt-4 border-t border-muted/20 pt-3">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-1 px-1">{translations[lang].roomCoordinateIdLabel}</span>
                  <div className="bg-muted/45 border border-muted p-2 rounded-xl text-[9px] font-mono break-all flex items-center justify-between gap-1.5 shadow-2xs">
                    <span className="truncate flex-1 select-all">{activeChat.id}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(activeChat.id)}
                      className="p-1 hover:bg-muted text-brand hover:text-brand-hover rounded-md transition shrink-0"
                      title={translations[lang].copyIdTooltip}
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
                  {translations[lang].inviteNewMemberLabel}
                </span>
                <form onSubmit={handleInviteUserAction} className="flex gap-1.5">
                  <Input
                    type="text"
                    value={inviteId}
                    onChange={(e) => setInviteId(e.target.value)}
                    placeholder={translations[lang].invitePlaceholder}
                    className="text-xs h-8 bg-card flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isInviting || !inviteId.trim()}
                    className="px-3 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg text-xs font-bold transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
                    title={translations[lang].invite}
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
                {translations[lang].teamMembersLabel.replace('{count}', String(activeChat.members?.length || 0))}
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
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {member.name}
                            </span>
                            {/* Admin Indicator */}
                            {(member.role === 'Admin' || member.role === 'Admin (Me)') && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 bg-brand-light text-brand-light-foreground">
                                {translations[lang].adminLabel}
                              </span>
                            )}
                            {/* Me Indicator */}
                            {(member.role === 'Me' || member.role === 'Admin (Me)') && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 bg-muted text-muted-foreground">
                                {translations[lang].meLabel}
                              </span>
                            )}
                            {/* Moderator Indicator */}
                            {member.role === 'Moderator' && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                                {translations[lang].moderatorLabel}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground truncate block font-mono">
                            {member.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Direct Message Option */}
                        {member.role !== 'Me' && member.role !== 'Admin (Me)' && onConnectChat && (
                          <button
                            onClick={() => {
                              onConnectChat(member.id);
                              setShowRoomDetails(false);
                            }}
                            className="p-1.5 hover:bg-brand/10 text-muted-foreground hover:text-brand rounded-md transition shrink-0 cursor-pointer border-none bg-transparent flex items-center justify-center"
                            title={translations[lang].messageUser}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Remove User Action */}
                        {activeChat.isGroup && activeChat.isAdmin && member.id !== activeChat.members?.[0]?.id && member.role !== 'Me' && member.role !== 'Admin (Me)' && onRemoveUser && (
                          <button
                            onClick={() => handleRemoveUserAction(member.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-md transition shrink-0 cursor-pointer"
                            title={translations[lang].removeMemberTooltip.replace('{name}', member.name)}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground italic">
                    {translations[lang].noMembersRoster}
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
                {activeChat.isAdmin ? translations[lang].destroyRoomButton : translations[lang].leaveRoomButton}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Forward Message Modal */}
      {forwardingMessage && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setForwardingMessage(null)}
        >
          <div
            className="bg-card border border-muted/50 rounded-2xl shadow-2xl flex flex-col max-w-sm mx-auto w-full overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  <Forward className="w-3.5 h-3.5 text-brand" />
                  {translations[lang].forwardMessage}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {forwardingMessage.text}
                </p>
              </div>
              <button
                onClick={() => setForwardingMessage(null)}
                className="p-1 hover:bg-muted rounded-full transition text-muted-foreground border-none bg-transparent cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b">
              <input
                type="text"
                placeholder={translations[lang].searchConversations}
                value={forwardSearchQuery}
                onChange={(e) => setForwardSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-3 py-1.5 text-xs bg-muted/50 border border-muted/30 rounded-lg outline-none focus:border-brand/40 text-foreground"
              />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto max-h-64 divide-y divide-muted/10">
              {(chats || []).filter(c =>
                c.id !== activeChat.id &&
                c.name.toLowerCase().includes(forwardSearchQuery.toLowerCase())
              ).map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleConfirmForward(chat)}
                  disabled={isSubmittingAction}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted transition cursor-pointer border-none bg-transparent text-left"
                >
                  <Avatar className={`h-8 w-8 border border-muted-foreground/10 shrink-0 ${chat.isGroup ? 'rounded-xl' : 'rounded-full'}`}>
                    <AvatarImage src={chat.avatar} alt={chat.name} className={`object-cover ${chat.isGroup ? 'rounded-xl' : 'rounded-full'}`} />
                    <AvatarFallback className={`text-[10px] font-bold ${chat.isGroup ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-100 rounded-xl' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 rounded-full'}`}>
                      {chat.initials || chat.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate block flex items-center gap-1">
                      {chat.isGroup && <Hash className="w-3 h-3 text-indigo-500 shrink-0" />}
                      {chat.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground truncate block">
                      {chat.isGroup
                        ? translations[lang].membersCount.replace('{count}', String(chat.members?.length || 0))
                        : (chat.online === true ? translations[lang].online : translations[lang].offline)}
                    </span>
                  </div>
                  <Forward className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 ml-auto" />
                </button>
              ))}
              {(chats || []).filter(c =>
                c.id !== activeChat.id &&
                c.name.toLowerCase().includes(forwardSearchQuery.toLowerCase())
              ).length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground italic">
                    {translations[lang].noConversations}
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t bg-muted/5 flex justify-end">
              <button
                onClick={() => setForwardingMessage(null)}
                className="px-3 h-8 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition cursor-pointer border-none bg-transparent"
              >
                {translations[lang].cancel}
              </button>
            </div>
          </div>
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
              title={translations[lang].downloadImageTooltip}
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition flex items-center justify-center cursor-pointer shadow-md border-none"
              title={translations[lang].closeTooltip}
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
                {translations[lang].shareMyContactCardHeader}
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
                {translations[lang].shareCardInstructions}
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
                      <span>{translations[lang].nameLabel}</span>
                      <input
                        type="checkbox"
                        checked={shareName}
                        onChange={(e) => setShareName(e.target.checked)}
                        className="rounded border-muted-foreground/30 text-brand focus:ring-brand h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground cursor-pointer select-none">
                      <span>{translations[lang].titleLabel}</span>
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
                {translations[lang].cancel}
              </button>
              <button
                onClick={handleShareCard}
                className="px-4 h-8 bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer border-none shadow-sm"
              >
                {translations[lang].shareLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
