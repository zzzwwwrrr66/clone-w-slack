import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useCallback } from 'react';
import { useParams } from "react-router";

// api
import fetcher from "@utils/fetcher";
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';

// utils
import useInput from '@hooks/useInput';
import autosize from 'autosize';
import useSocket from '@hooks/useSocket';

//types
import { IUser, IChannel, IDM } from '@typings/db';

const ChatBox = () => {
  const params = useParams<{workspace: string, dm: string}>()
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const [chat, changeChat, setChat] = useInput('');
  const { data: memberListData, mutate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${params?.workspace}/members` : null,
    fetcher,
  );
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${params?.workspace}/dms/${params?.dm}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  // const [socket] = useSocket(params?.workspace);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
    .post(`/api/workspaces/${params?.workspace}/dms/${params?.dm}/chats`, {
      content: chat,
    })
    .then(()=>{setChat('')})
    .catch((err)=>{console.dir(err.responce)});
  }, []);

  const onEnter = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend(e);
    }
  }, []);

  return(
    <>
    <form onSubmit={onSend}>
      <textarea placeholder={`send chat...`} onChange={changeChat} onKeyPress={onEnter} ref={textareaRef}></textarea>
      <div>
        <button type='submit' >Send</button>
      </div>
    </form>
    </>
  )
}

export default ChatBox;