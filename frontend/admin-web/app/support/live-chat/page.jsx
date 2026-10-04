"use client";

import { useState, useRef, useEffect } from "react";

const initialConversations = [
  { id: 1, name: "John Doe", status: "Active", lastMessage: "Hi, how can I track my order?", time: "2m", unread: 1, avatar: "J" },
  { id: 2, name: "Sarah Wilson", status: "Active", lastMessage: "I need help with refund", time: "5m", unread: 0, avatar: "S" },
  { id: 3, name: "Mike Brown", status: "Closed", lastMessage: "Product not working", time: "10m", unread: 0, avatar: "M" },
  { id: 4, name: "Emily Davis", status: "Closed", lastMessage: "Shipping time inquiry", time: "15m", unread: 0, avatar: "E" },
  { id: 5, name: "David Lee", status: "Closed", lastMessage: "Payment issue", time: "20m", unread: 0, avatar: "D" },
];

const initialMessages = [
  { id: 1, sender: "user", text: "Hi, how can I track my order?", time: "2 mins ago" },
  { id: 2, sender: "admin", text: "Hello! You can track your order using the tracking link sent to your email.", time: "1 min ago" },
  { id: 3, sender: "user", text: "Thank you!", time: "Just now" },
];

export default function LiveChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const filteredConversations = conversations.filter(c => {
    if (activeTab === "active" && c.status !== "Active") return false;
    if (activeTab === "closed" && c.status !== "Closed") return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedChat = conversations.find(c => c.id === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: "admin",
      text: inputText,
      time: "Just now"
    };
    
    setMessages([...messages, newMsg]);
    setInputText("");
    
    // Simulate user typing a reply after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "user",
        text: "Thanks, that's really helpful!",
        time: "Just now"
      }]);
    }, 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto h-[calc(100vh-2rem)] flex flex-col bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Support & Help</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Live Chat</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Live Chat</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Conversations Sidebar */}
        <div className="w-full lg:w-[350px] shrink-0 bg-[#1A1827] border border-[#2d2c45] rounded-2xl flex flex-col overflow-hidden h-[600px] lg:h-auto">
          <div className="p-4 border-b border-[#2d2c45] space-y-3">
            <div className="flex items-center gap-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 focus-within:border-[#8C63F5] transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#0F0E17] p-1 rounded-lg border border-[#2d2c45]">
              {['all', 'active', 'closed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                    activeTab === tab 
                      ? "bg-[#2d2c45] text-white shadow-sm" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No conversations found.</div>
            ) : filteredConversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedChatId(conv.id)}
                className={`p-4 cursor-pointer transition-colors border-b border-[#2d2c45]/50 flex items-start gap-3 ${
                  selectedChatId === conv.id 
                    ? "bg-[#8C63F5]/10" 
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                    conv.status === 'Active' ? 'bg-gradient-to-br from-[#10B861] to-[#0d944e]' : 'bg-zinc-700'
                  }`}>
                    {conv.avatar}
                  </div>
                  {conv.status === 'Active' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B861] border-2 border-[#1A1827]"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-medium ${conv.unread > 0 ? 'text-white' : 'text-slate-200'}`}>
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${conv.unread > 0 ? 'text-[#8C63F5] font-medium' : 'text-slate-400'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#8C63F5] text-white text-[9px] font-bold shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-[#1A1827] border border-[#2d2c45] rounded-2xl flex flex-col h-[600px] lg:h-auto overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#2d2c45] flex items-center justify-between bg-[#0F0E17]/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[#10B861] to-[#0d944e]">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.status === 'Active' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B861] border-2 border-[#0F0E17]"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight">{selectedChat.name}</h2>
                    <p className="text-xs text-[#10B861] font-medium">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors hidden sm:block">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                  <button className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                  <button className="ml-2 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors border border-red-500/20">
                    End Chat
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                <div className="text-center text-xs text-slate-500 my-2">
                  Chat started today
                </div>
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[75%] animate-slide-up ${msg.sender === 'admin' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'admin' 
                        ? 'bg-[#8C63F5] text-white rounded-tr-sm shadow-[0_2px_10px_rgba(140,99,245,0.2)]' 
                        : 'bg-[#0F0E17] border border-[#2d2c45] text-slate-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex flex-col max-w-[75%] self-start items-start animate-fade-in">
                    <div className="px-4 py-3 bg-[#0F0E17] border border-[#2d2c45] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#2d2c45] bg-[#0F0E17]/50 shrink-0">
                <div className="flex items-end gap-2 bg-[#1A1827] border border-[#2d2c45] rounded-xl p-2 focus-within:border-[#8C63F5] transition-colors">
                  <button className="p-2 text-slate-400 hover:text-[#8C63F5] rounded-lg transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <textarea
                    rows="1"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none p-2 text-sm text-slate-200 placeholder-slate-500 outline-none resize-none max-h-32 min-h-[40px]"
                    style={{ height: 'auto' }}
                  ></textarea>
                  <button className="p-2 text-slate-400 hover:text-[#8C63F5] rounded-lg transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#8C63F5] text-white rounded-lg hover:bg-[#7b53e4] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
                </div>
                <div className="text-center text-[10px] text-slate-500 mt-2">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">forum</span>
              <p className="text-lg font-medium text-slate-400">Select a conversation</p>
              <p className="text-sm mt-1">Choose an active chat from the sidebar to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
