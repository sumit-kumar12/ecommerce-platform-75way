"use client";

import React, { useState } from 'react';

export default function BroadcastNotifications() {
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('all');
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState({
    push: true,
    email: false,
    inApp: true,
  });

  const handleChannelChange = (channel) => {
    setChannels({ ...channels, [channel]: !channels[channel] });
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] text-gray-200 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-white">Broadcast Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">Create and send announcements to users across multiple channels.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel: Create Broadcast Form */}
          <div className="flex-1 bg-[#1A1827] border border-[#2d2c45] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Create Broadcast</h2>
            
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Internal Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Summer Sale Announcement"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Users</option>
                  <option value="buyers">Buyers Only</option>
                  <option value="sellers">Sellers Only</option>
                  <option value="premium">Premium Members</option>
                </select>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Channels</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={channels.inApp}
                      onChange={() => handleChannelChange('inApp')}
                      className="rounded border-[#2d2c45] bg-[#0F0E17] text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm">In-App</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={channels.push}
                      onChange={() => handleChannelChange('push')}
                      className="rounded border-[#2d2c45] bg-[#0F0E17] text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Push Notification</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={channels.email}
                      onChange={() => handleChannelChange('email')}
                      className="rounded border-[#2d2c45] bg-[#0F0E17] text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message Content</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full bg-[#0F0E17] border border-[#2d2c45] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Enter the broadcast message..."
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="schedule" defaultChecked className="text-indigo-500 focus:ring-indigo-500 bg-[#0F0E17] border-[#2d2c45]" />
                    <span className="text-sm">Send Immediately</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="schedule" className="text-indigo-500 focus:ring-indigo-500 bg-[#0F0E17] border-[#2d2c45]" />
                    <span className="text-sm">Schedule for Later</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-[#2d2c45]">
                <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                  Save Draft
                </button>
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="flex-1 lg:max-w-md space-y-6">
            <div className="bg-[#1A1827] border border-[#2d2c45] rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>
              
              <div className="space-y-6">
                {channels.inApp && (
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase font-semibold mb-3">In-App Notification</h3>
                    <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                      <p className="text-sm text-white font-medium">{title || "Notification Title"}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {message || "Your notification message will appear here. Start typing to see the preview."}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-2 block">Just now</span>
                    </div>
                  </div>
                )}

                {channels.push && (
                  <div>
                    <h3 className="text-xs text-gray-500 uppercase font-semibold mb-3">Push Notification (Mobile)</h3>
                    <div className="bg-[#0F0E17] border border-[#2d2c45] rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">App</span>
                        </div>
                        <span className="text-xs text-gray-400">KataBazaar • now</span>
                      </div>
                      <p className="text-sm text-white font-medium">{title || "Notification Title"}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {message || "Your push notification message goes here."}
                      </p>
                    </div>
                  </div>
                )}
                
                {!channels.inApp && !channels.push && !channels.email && (
                  <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-[#2d2c45] rounded-lg">
                    Select a channel to see preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
