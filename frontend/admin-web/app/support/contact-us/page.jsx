"use client";

import { useState } from "react";

const initialMessages = [
  { id: 1, name: "Robert Fox", email: "robert@email.com", subject: "Product Inquiry", status: "New", date: "1h ago", fullDate: "May 20, 2026", ip: "192.168.1.1", message: "I would like to know more about the premium plan features and pricing. Can someone contact me?", read: false },
  { id: 2, name: "Jenny Wilson", email: "jenny@email.com", subject: "Partnership", status: "Read", date: "3h ago", fullDate: "May 20, 2026", ip: "10.0.0.5", message: "We are interested in exploring a potential partnership for distribution in Europe.", read: true },
  { id: 3, name: "Wade Warren", email: "wade@email.com", subject: "Complaint", status: "New", date: "5h ago", fullDate: "May 20, 2026", ip: "172.16.0.4", message: "The package arrived damaged and the courier refused to take it back.", read: false },
  { id: 4, name: "Devon Lane", email: "devon@email.com", subject: "Support", status: "Replied", date: "1d ago", fullDate: "May 19, 2026", ip: "192.168.0.100", message: "How do I upgrade my account from basic to pro?", read: true },
];

export default function ContactUsPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState(initialMessages[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [replyText, setReplyText] = useState("");

  const filteredMessages = messages.filter(m => {
    if (statusFilter !== "All Status" && m.status !== statusFilter) return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Read": return "bg-zinc-800 text-slate-300 border-zinc-700";
      case "Replied": return "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20";
      default: return "bg-zinc-800 text-slate-400 border-zinc-700";
    }
  };

  const handleSelectMessage = (id) => {
    setSelectedMessageId(id);
    const updatedMessages = messages.map(m => {
      if (m.id === id && !m.read && m.status === "New") {
        return { ...m, read: true, status: "Read" };
      }
      return m;
    });
    setMessages(updatedMessages);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    const updatedMessages = messages.map(m => {
      if (m.id === selectedMessage.id) {
        return { ...m, status: "Replied" };
      }
      return m;
    });
    setMessages(updatedMessages);
    setReplyText("");
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-2rem)] flex flex-col bg-[#0F0E17]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-slate-300">Support & Help</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300">Contact Us</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Contact Us Submissions</h1>
          <p className="text-slate-400 mt-1 text-sm">View & respond to contact form messages</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Inbox List (Left Pane) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 bg-[#1A1827] border border-[#2d2c45] rounded-2xl flex flex-col overflow-hidden h-[800px] lg:h-auto">
          <div className="p-4 border-b border-[#2d2c45] space-y-3">
            <div className="flex items-center gap-2 bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-3 py-2 focus-within:border-[#8C63F5] transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 bg-[#0F0E17] border border-[#2d2c45] text-sm text-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#8C63F5]"
              >
                <option>All Status</option>
                <option>New</option>
                <option>Read</option>
                <option>Replied</option>
              </select>
              <select 
                className="flex-1 bg-[#0F0E17] border border-[#2d2c45] text-sm text-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#8C63F5]"
              >
                <option>All Dates</option>
                <option>Today</option>
                <option>Yesterday</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#2d2c45]">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No messages found.</div>
            ) : filteredMessages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => handleSelectMessage(msg.id)}
                className={`p-4 cursor-pointer transition-colors relative ${
                  selectedMessageId === msg.id 
                    ? "bg-[#8C63F5]/10 border-l-2 border-l-[#8C63F5]" 
                    : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                }`}
              >
                {!msg.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
                <div className="flex justify-between items-start mb-1 pr-4">
                  <span className={`text-sm ${!msg.read ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>
                    {msg.name}
                  </span>
                  <span className={`text-xs ${!msg.read ? 'text-[#8C63F5] font-medium' : 'text-slate-500'}`}>
                    {msg.date}
                  </span>
                </div>
                <p className={`text-sm mb-2 ${!msg.read ? 'text-white font-medium' : 'text-slate-300'}`}>{msg.subject}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 line-clamp-1 flex-1 pr-4">{msg.message}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Pane (Right Pane) */}
        <div className="flex-1 bg-[#1A1827] border border-[#2d2c45] rounded-2xl flex flex-col h-[800px] lg:h-auto overflow-hidden relative">
          {selectedMessage ? (
            <>
              {/* Message Header Info */}
              <div className="p-6 border-b border-[#2d2c45] bg-[#0F0E17]/50">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <button className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8C63F5] to-[#5c3eab] flex items-center justify-center text-lg font-bold text-white shadow-lg">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">From</p>
                      <p className="text-sm font-medium text-white">{selectedMessage.name}</p>
                      <p className="text-xs text-[#8C63F5]">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs text-slate-500">Submission Details</p>
                        <select className="bg-transparent border-none text-[11px] font-medium text-slate-400 outline-none cursor-pointer">
                          <option>Update Status</option>
                          <option>Mark as Replied</option>
                          <option>Close</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-300">{selectedMessage.fullDate}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(selectedMessage.status)}`}>
                          {selectedMessage.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">IP: {selectedMessage.ip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-sm text-slate-300 font-medium mb-4">Message:</p>
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-[#0F0E17] border border-[#2d2c45] p-5 rounded-xl">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-[#2d2c45] bg-[#0F0E17]">
                <textarea
                  rows="4"
                  placeholder={`Reply to ${selectedMessage.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#1A1827] border border-[#2d2c45] rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-[#8C63F5] transition-colors resize-none mb-4"
                ></textarea>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">format_bold</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">format_italic</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">link</span>
                    </button>
                  </div>
                  <button 
                    onClick={handleReply}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#8C63F5] text-white rounded-lg text-sm font-medium hover:bg-[#7b53e4] transition-colors shadow-lg shadow-[#8C63F5]/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Send Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">mail</span>
              <p className="text-lg font-medium text-slate-400">Select a message</p>
              <p className="text-sm mt-1">Choose a submission from the list to view its contents</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
