import React, {FC, useEffect, useState, useCallback} from 'react'
//api
import axios from 'axios';
import useSWR,{useSWRInfinite} from 'swr';
import fetcher from '@utils/fetcher';
import testFetcher from '@utils/testFetcher';


// router
import { Link, Redirect, useParams } from 'react-router-dom';

//components
import WorkSpace from '@layouts/workSpace';
import CommonChatBox from '@components/commonChatBox';

// types 
import {IDM} from '@typings/db'

const Channel:FC = () => {
  const params = useParams<{workspace: string, channel: string}>()
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${params?.workspace}/channels/${params?.channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const [chat, setChat] = useState('');

  const onChangeChat = (v) => {
    setChat(v.target.value);
  }

  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(chat !== '') {
      axios
      .post(`/api/workspaces/${params?.workspace}/channels/${params?.channel}/chats`, {
        content: chat,
      })
      .then((res)=>{
        setChat('');
        mutateChat();
      })
      .catch((err)=>{console.dir(err.responce)});
    }
  }, [chat]);

  if(data === undefined) {
    return (
      <h2>loading...</h2>
    )
  }

  if(!data) {
    return (
      <Redirect exact to='/login' from='/workspace/channel'/>
    )
  }

  return(
    <>
      <h1>HI {data?.nickname} CHANNEL</h1>
      <CommonChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
    </>
  )
}

export default Channel;