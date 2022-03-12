import React, {FC, useEffect, useRef, useState, useCallback} from 'react'

//api
import axios from 'axios';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';
import testFetcher from '@utils/testFetcher';

// router
import { Link, Redirect, useParams } from 'react-router-dom';

//components
import WorkSpace from '@layouts/workSpace';
import ChatBox from '@components/chatBox';
import DmChatList from '@components/dmChatList';

//custom hook
import useInput from '@hooks/useInput';

// types 
import { IUser } from '@typings/db';

// css 
import {Container, Header, DragOver} from './style';

// utils 
import gravatar from 'gravatar';

// types 
import { IDM } from '@typings/db'; 
import Scrollbars from 'react-custom-scrollbars';


const DirectMassege:FC = ({children}) => {
  const {workspace: workspaceParam, dm: dmParam} = useParams<{workspace: string, dm: string}>()
  const { data:meData, error:meError, mutate: meMutate } = useSWR('/api/users', fetcher);

  const {data: currectUserData} = useSWR<IUser>(`/api/workspaces/${workspaceParam}/users/${dmParam}`)
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspaceParam}/dms/${dmParam}/chats?perPage=20&page=${index + 1}`,
    fetcher,
    );
    
  const scrollbarRef = useRef<Scrollbars>(null);
  const [chat, setChat] = useState('');

  useEffect(() => {
    if(scrollbarRef) console.log(scrollbarRef.current);
    return () => {
    }
  }, [scrollbarRef]);

  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);


  const onChathange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat(e.target.value);
  }

  const onSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(chat !== '') {
      axios
      .post(`/api/workspaces/${workspaceParam}/dms/${dmParam}/chats`, {
        content: chat,
      })
      .then((res)=>{
        setChat('');
        mutateChat();
        scrollbarRef.current?.scrollToBottom();
      })
      .catch((err)=>{console.dir(err.responce)});
    }
  }, [chat]);

  if(meData === undefined) {
    return (
      <h2>loading...</h2>
    )
  }

  if(!meData) {
    return (
      <Redirect exact to='/login' from='/workspace/channel'/>
    )
  }

  return(
    <>
    <Container>
      <Header>
      <img src={gravatar.url(currectUserData?.email, { s: '24px', d: 'retro' })} alt={currectUserData?.nickname} />
        <span>{currectUserData?.nickname}</span>
        <span>{currectUserData?.id === meData?.id && `(me)`}</span>
      </Header> 
      <DmChatList ref={scrollbarRef}/>
      <ChatBox 
        onSend={onSend} 
        onChathange={onChathange} 
        chat={chat}
      />
    </Container>
    </>
  )
}

export default DirectMassege;