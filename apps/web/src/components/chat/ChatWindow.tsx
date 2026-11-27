import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Video,
  Phone,
  Search,
  Info,
  ArrowLeft,
  Smile,
  Paperclip,
  Send,
  Check,
  CheckCheck,
} from 'lucide-react';
import {
  type ChatRoom,
  type Message,
  type MessageStatus,
  type UserPresenceInfo,
  slimScrollbar,
} from '../../types/chat';

interface ChatWindowProps {
  activeChat: ChatRoom | null;
  messages: Message[];
  currentUserId?: string;
  presenceMap: Record<string, UserPresenceInfo>;
  showRightPanel: boolean;
  onToggleRightPanel: () => void;
  onBack: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onOpenNewChat: () => void;
}

export default function ChatWindow({
  activeChat,
  messages,
  currentUserId,
  presenceMap,
  showRightPanel,
  onToggleRightPanel,
  onBack,
  onSendMessage,
  onOpenNewChat,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, [messages.length, activeChat?.id]);

  const getOtherUid = (chat: ChatRoom) => {
    if (chat.isGroup) return undefined;
    return chat.participants.find((id) => id !== currentUserId);
  };

  const getChatName = (chat: ChatRoom) => {
    if (chat.isGroup) return chat.name || 'Unnamed Group';
    const otherUid = getOtherUid(chat);
    return (otherUid && chat.participantDetails?.[otherUid]?.displayName) || 'Direct Chat';
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.isGroup) return null;
    const otherUid = getOtherUid(chat);
    return (otherUid && chat.participantDetails?.[otherUid]?.photoURL) || null;
  };

  const renderPresenceSubtitle = (chat: ChatRoom) => {
    if (chat.isGroup) {
      const onlineCount = chat.participants.filter(
        (uid) => uid !== currentUserId && presenceMap[uid]?.isOnline
      ).length;
      return (
        <p className="text-[12px] text-gray-400 leading-tight mt-0.5 truncate">
          {chat.participants.length} members
          {onlineCount > 0 && <span className="text-[#00FF85]"> • {onlineCount} online</span>}
        </p>
      );
    }

    const otherUid = getOtherUid(chat);
    const presence = otherUid ? presenceMap[otherUid] : undefined;

    if (presence?.isOnline) {
      return (
        <p className="text-[12px] text-[#00FF85] font-medium leading-tight mt-0.5 truncate">
          online
        </p>
      );
    }

    return (
      <p className="text-[12px] text-gray-400 leading-tight mt-0.5 truncate">
        {presence?.statusText || 'offline'}
      </p>
    );
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp?.seconds) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resolveMessageStatus = (msg: Message, isLastMessage: boolean): MessageStatus => {
    if (msg.status === 'read') return 'read';
    if (isLastMessage && activeChat?.lastMessageStatus === 'read') return 'read';
    if (msg.status === 'delivered') return 'delivered';
    if (isLastMessage && activeChat?.lastMessageStatus === 'delivered') return 'delivered';
    return 'sent';
  };

  const renderTickIcon = (status: MessageStatus) => {
    if (status === 'read') {
      return (
        <span title="Seen" className="inline-flex items-center">
          <CheckCheck size={14} className="text-[#38BDF8]" />
        </span>
      );
    }
    if (status === 'delivered') {
      return (
        <span title="Delivered" className="inline-flex items-center">
          <CheckCheck size={14} className="text-gray-400" />
        </span>
      );
    }
    return (
      <span title="Sent" className="inline-flex items-center">
        <Check size={14} className="text-gray-400" />
      </span>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage('');
    await onSendMessage(text);
  };

  const otherUid = activeChat ? getOtherUid(activeChat) : undefined;
  const isOtherOnline = otherUid ? Boolean(presenceMap[otherUid]?.isOnline) : false;

  return (
    <main
      className={`flex-1 flex-col bg-[#050C0A] relative min-w-0 ${
        activeChat ? 'flex' : 'hidden md:flex'
      }`}
    >
      {activeChat ? (
        <>
          {/* Header */}
          <header className="h-[62px] px-4 border-b border-white/10 bg-[#07110E] flex items-center justify-between shrink-0 z-10">
            <div onClick={onToggleRightPanel} className="flex items-center gap-3 min-w-0 cursor-pointer">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                className="md:hidden p-1.5 -ml-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative shrink-0">
                {activeChat.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-[#00FF85]/15 flex items-center justify-center text-[#00FF85]">
                    <Users size={18} />
                  </div>
                ) : getChatAvatar(activeChat) ? (
                  <img src={getChatAvatar(activeChat)!} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0F2E22] border border-[#00FF85]/25 text-[#00FF85] flex items-center justify-center font-bold">
                    {getChatName(activeChat).charAt(0).toUpperCase()}
                  </div>
                )}
                {!activeChat.isGroup && isOtherOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00FF85] border-2 border-[#07110E] rounded-full" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-white leading-tight truncate">
                  {getChatName(activeChat)}
                </h2>
                {renderPresenceSubtitle(activeChat)}
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-400">
              <button className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                <Video size={18} />
              </button>
              <button className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                <Phone size={17} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                <Search size={17} />
              </button>
              <button
                onClick={onToggleRightPanel}
                title="Chat Info"
                className={`p-2 rounded-full transition ${
                  showRightPanel ? 'bg-[#00FF85]/15 text-[#00FF85]' : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                <Info size={18} />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div
            style={{
              backgroundImage: 'radial-gradient(rgba(0, 255, 133, 0.04) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
            className={`flex-1 overflow-y-auto px-4 sm:px-8 lg:px-14 py-4 flex flex-col ${slimScrollbar}`}
          >
            <div className="flex justify-center mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#0B1915] text-[11px] font-medium text-gray-400 border border-white/5 shadow-sm">
                Today
              </span>
            </div>

            {messages.length === 0 && (
              <div className="my-auto text-center">
                <p className="inline-block px-4 py-2 rounded-xl bg-[#0B1915] border border-white/5 text-xs text-gray-400">
                  Messages are private. Say hello to start the conversation!
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const isSameSenderAsPrev = prevMsg?.senderId === msg.senderId;
              const isLastMessage = idx === messages.length - 1;
              const status = resolveMessageStatus(msg, isLastMessage);

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${
                    isSameSenderAsPrev ? 'mt-1' : 'mt-3'
                  }`}
                >
                  <div
                    className={`relative max-w-[82%] sm:max-w-[65%] px-3.5 py-2 shadow-sm ${
                      isMe
                        ? `bg-[#0D2E23] border border-[#00FF85]/20 text-gray-100 rounded-2xl ${
                            !isSameSenderAsPrev ? 'rounded-tr-sm' : ''
                          }`
                        : `bg-[#101E1A] border border-white/[0.06] text-gray-100 rounded-2xl ${
                            !isSameSenderAsPrev ? 'rounded-tl-sm' : ''
                          }`
                    }`}
                  >
                    {!isMe && activeChat.isGroup && !isSameSenderAsPrev && (
                      <p className="text-[11px] font-semibold text-[#00FF85] mb-0.5">{msg.senderName}</p>
                    )}

                    <div className="flex flex-wrap items-end gap-x-2.5">
                      <span className="text-[14px] leading-[1.4] break-words whitespace-pre-wrap">
                        {msg.text}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] ml-auto pt-1 shrink-0 select-none ${
                          isMe ? 'text-gray-300/75' : 'text-gray-400/80'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                        {isMe && renderTickIcon(status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="px-3 sm:px-4 py-2.5 bg-[#07110E] border-t border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Emoji"
                className="p-2 rounded-full text-gray-400 hover:bg-white/5 hover:text-[#00FF85] transition"
              >
                <Smile size={20} />
              </button>
              <button
                type="button"
                title="Attach"
                className="p-2 rounded-full text-gray-400 hover:bg-white/5 hover:text-[#00FF85] transition"
              >
                <Paperclip size={19} />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#0C1B17] text-sm text-white placeholder-gray-500 px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-[#00FF85]/50 transition min-w-0"
              />

              <button
                type="submit"
                disabled={!newMessage.trim()}
                title="Send Message"
                className="p-2.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] flex items-center justify-center transition shadow-md shadow-[#00FF85]/15 shrink-0"
              >
                <Send size={17} />
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mb-4">
            <MessageSquare size={30} className="text-[#00FF85]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1.5">Sutraa Web</h2>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Send and receive real-time private messages using exact @usernames.
          </p>
          <button
            onClick={onOpenNewChat}
            className="px-5 py-2.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-sm font-bold transition"
          >
            + New Conversation
          </button>
        </div>
      )}
    </main>
  );
}