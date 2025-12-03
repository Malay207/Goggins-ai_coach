"use client"

import { userthreadatom } from '@/atoms'
import axios from 'axios'
import { useAtom } from 'jotai'
// import { Run } from 'openai/resources/beta/threads/index.mjs'
// import { Message } from 'openai/src/resources/beta/threads/messages.js'

import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
type ChatMessage = {
  _id: string;
  threadId: string;
  role: "user" | "assistant";
  content: string;
  date: string;
};
const ChatPage = () => {
  const [Userthread] = useAtom(userthreadatom);
  // const [Assistant] = useAtom(assistantatom)
  const [fetchingmsg, setfetchingmsg] = useState(false)
  const [message, setmesssage] = useState<ChatMessage[]>([]);
  const [pollingrun, setpollingrun] = useState(false);
  const [msg, setmsg] = useState('');
  const [sending, setsending] = useState(false)
  // const [pollingrun, setpollingrun] = useState(false)
  const [intervalid, setintervalid] = useState(true);
  const fetchmsg = useCallback(
    async () => {
      if (!Userthread) return;
      if (intervalid) {
        setfetchingmsg(true);
      }
      try {
        const response = await axios.post<{
          success: boolean;
          error?: string;
          messages?: ChatMessage[];
        }>("/api/message/list", { threadId: Userthread.ThreadId });

        if (!response.data.success || !response.data.messages) {
          console.error(response.data.error);
          return;
        }
        let newmsg = response.data.messages;

        newmsg = newmsg
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .filter((msg) => msg.content.trim() !== "");

        setmesssage(newmsg);
      } catch (error) {
        console.log(error);
        setmesssage([]);
      } finally {
        setfetchingmsg(false);
      }
    },
    [Userthread, intervalid]
  );


  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchmsg();
      if (message.length === 0) {
        setintervalid(false)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [fetchmsg, message]);



  const sendMessage = async () => {
    if (!Userthread || sending || !msg.trim()) {
      toast.error("Failed to send message. Please try again");
      return;
    }
    setsending(true);
    setpollingrun(true);

    try {
      // 1. Save user message
      const {
        data: { message: newmsg, success },
      } = await axios.post<{
        success: boolean;
        error?: string;
        message?: ChatMessage;
      }>("/api/message/create", {
        threadId: Userthread.ThreadId,
        message: msg,
        fromUser: "true",
      });

      if (!success || !newmsg) {
        console.error("no message returned");
        toast.error("Failed to send message. Please try again");
        return;
      }

      setmesssage((prev) => [...prev, newmsg]);
      setmsg("");
      toast.success("Message sent");

      // 2. Ask Gemini for a reply
      const { data } = await axios.post<{
        success: boolean;
        error?: string;
        message?: ChatMessage;
      }>("/api/chat/gemini", {
        threadId: Userthread.ThreadId,
      });

      if (!data.success) {
        console.error(data.error);
        toast.error("Failed to get AI response");
      } else if (data.message) {
        setmesssage((prev) => [...prev, data.message!]);
      }
      setpollingrun(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message. Please try again");
    } finally {
      setsending(false);
      // setpollingrun(false);
      fetchmsg();
    }
  };


  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col bg-black text-white '>
      {pollingrun && (
        <div className="text-gray-400 text-lg mb-3 mt-2">
          <span className="animate-pulse">...</span>
        </div>
      )}
      {/* messages */}
      <div className='flex-grow overflow-y-scroll p-8 space-y-2 '>
        {/* fetch msg */}
        {
          fetchingmsg && message.length === 0 && (<div className='text-center font-bold'>Fetching....</div>)
        }
        {/* no message */}
        {message.length === 0 && !fetchingmsg && (<div className='text-center font-bold'>No messages.</div>)}

        {/* listing messages */}
        {
          message.map((m) => (
            <div
              key={m._id}
              className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${m.role === "user" ? "bg-yellow-500 ml-auto" : "bg-gray-700"
                }`}
            >
              <p>
                {m.content
                  .replace(/\*\*/g, "")        // remove bold marks
                  .replace(/\*/g, "")          // remove italic marks
                  .replace(/##+/g, "")         // remove headings
                  .replace(/`/g, "")           // remove inline code ticks
                  .split("\n")
                  .map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
              </p>
            </div>
          ))

        }
      </div>
      {/* input container */}
      <div className='mt-auto p-4 bg-gray-800'>
        <div className='flex items-center bg-white p-2'>
          <input
            type='text'
            className='flex-grow bg-transparent focus:outline-none text-black'
            placeholder='Type your message here...'
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
          />
          <button disabled={!Userthread || sending || !msg.trim()}
            className='ml-4 bg-yellow-500 px-4 text-white py-2 rounded-full focus:outline-none disabled:bg-yellow-700'
            onClick={sendMessage}
          >{sending ? "sending..." : pollingrun ? "polling Run..." : "Send"}</button>
        </div>

      </div>
    </div>
  )
}

export default ChatPage