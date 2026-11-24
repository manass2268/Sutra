import {Users,UserPlus,Phone,Video,MoreVertical,Image as ImageIcon,Pin,FileText,Settings,ChevronRight,Search,X,}from 'lucide-react';
import { type ChatRoom, slimScrollbar } from '../../types/chat';
interface ChatInfoPanelProps {
  activeChat: ChatRoom;
  currentUserId?: string;
  onClose: () => void;
}

export default function ChatInfoPanel({ activeChat, currentUserId, onClose }: ChatInfoPanelProps) {
  const getChatName = () => {
    if (activeChat.isGroup) return activeChat.name || 'Unnamed Group';
    const otherUid = activeChat.participants.find((id) => id !== currentUserId);
    return (otherUid && activeChat.participantDetails?.[otherUid]?.displayName) || 'Direct Chat';
  };

  const getChatAvatar = () => {
    if (activeChat.isGroup) return null;
    const otherUid = activeChat.participants.find((id) => id !== currentUserId);
    return (otherUid && activeChat.participantDetails?.[otherUid]?.photoURL) || null;
  };

  const getOtherUsername = () => {
    if (activeChat.isGroup) return `${activeChat.participants.length} members`;
    const otherUid = activeChat.participants.find((id) => id !== currentUserId);
    const uname = otherUid && activeChat.participantDetails?.[otherUid]?.username;
    return uname ? `@${uname}` : 'Active now';
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/60 z-30 xl:hidden" />
      <aside
        className={`fixed xl:static inset-y-0 right-0 z-40 w-[290px] bg-[#07110E] border-l border-white/10 flex flex-col overflow-y-auto shrink-0 shadow-2xl xl:shadow-none ${slimScrollbar}`}
      >
        <div className="h-[60px] px-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <span className="text-sm font-semibold text-gray-200">
            {activeChat.isGroup ? 'Group info' : 'Contact info'}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Profile Summary */}
        <div className="px-6 py-6 flex flex-col items-center text-center border-b border-white/10">
          {activeChat.isGroup ? (
            <div className="w-20 h-20 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85] mb-3">
              <Users size={32} />
            </div>
          ) : getChatAvatar() ? (
            <img src={getChatAvatar()!} alt="" className="w-20 h-20 rounded-full object-cover mb-3" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#0F2E22] border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center text-2xl font-bold mb-3">
              {getChatName().charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-base font-bold text-white">{getChatName()}</h3>
          <p className="text-xs text-[#00FF85]/80 mt-0.5">{getOtherUsername()}</p>

          <div className="grid grid-cols-4 gap-2 w-full mt-5">
            {[
              { icon: UserPlus, label: 'Add' },
              { icon: Phone, label: 'Call' },
              { icon: Video, label: 'Video' },
              { icon: MoreVertical, label: 'More' },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-[#0C1B17] hover:bg-[#00FF85]/10 hover:text-[#00FF85] transition text-gray-300"
              >
                <item.icon size={16} />
                <span className="text-[10px] text-gray-400">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Links */}
        <div className="p-3 space-y-1 border-b border-white/10">
          {[
            { icon: ImageIcon, label: 'Media, files & links', count: '0' },
            { icon: Pin, label: 'Pinned messages', count: '0' },
            { icon: FileText, label: 'Shared documents', count: '0' },
            { icon: Settings, label: activeChat.isGroup ? 'Group settings' : 'Chat settings', count: '' },
          ].map((row) => (
            <button
              key={row.label}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition text-sm text-gray-300"
            >
              <div className="flex items-center gap-3">
                <row.icon size={16} className="text-[#00FF85]/80" />
                <span>{row.label}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {row.count && <span>{row.count}</span>}
                <ChevronRight size={15} />
              </div>
            </button>
          ))}
        </div>

        {/* Members List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Members ({activeChat.participants.length})
            </span>
            <Search size={14} className="text-gray-500" />
          </div>

          <div className="space-y-3">
            {activeChat.participants.map((uid) => {
              const detail = activeChat.participantDetails?.[uid];
              const isYou = uid === currentUserId;
              const isAdmin = uid === activeChat.createdBy;
              return (
                <div key={uid} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center text-xs font-bold shrink-0">
                      {(detail?.displayName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 truncate">
                        {detail?.displayName || 'User'} {isYou && '(You)'}
                      </p>
                      {detail?.username && (
                        <p className="text-[11px] text-gray-500 truncate">@{detail.username}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[11px] shrink-0 ${isAdmin ? 'text-[#00FF85] font-medium' : 'text-gray-500'}`}>
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}