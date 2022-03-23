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
import CommonChatBox from '@components/CommonChatBox';
import ChannelChatList from '@components/ChannelChatList';

//custom hook
import useInput from '@hooks/useInput';

// types 

// css 
import {Container, Header, DragOver} from './style';

// utils 
import gravatar from 'gravatar';

// types 
import { IDM, IChat } from '@typings/db'; 
import Scrollbars from 'react-custom-scrollbars';

//websocket
import useSocket from '@hooks/useSocket';


const Channel:FC = ({children}) => {
  const {workspace: workspaceParam, channel: channelParam} = useParams<{workspace: string, channel: string}>()
  const [socket, disconnect] = useSocket(workspaceParam);
  const { data:meData, error:meError, mutate: meMutate } = useSWR('/api/users', fetcher);

  // const {data: currectUserData} = useSWR<IUser>(`/api/workspaces/${workspaceParam}/users/${meData.}`)

  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspaceParam}/channels/${channelParam}/chats?perPage=20&page=${index + 1}`,
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
  }, []);

  useEffect(() => {
    socket.on('message', onMssage);
    return () => {
      socket?.off('message', onMssage);
    };
  }, [socket]);

  const onMssage = (socketChnnelMessageData:IChat) => {
    // Other to me message
    if (socketChnnelMessageData.UserId !== meData.id) {
      mutateChat((chatData)=>{
        chatData?.[0].unshift(socketChnnelMessageData)
        return chatData
      }, false)
      .then(()=>{
        if(scrollbarRef.current) {
          if(
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            scrollbarRef.current?.scrollToBottom();
          }
        }
      })
    }
  }


  const onChathange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat(e.target.value);
  }

  const onSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(chatData && chat.trim() !== '') {
      const savedChat = chat;

      axios.post(`/api/workspaces/${workspaceParam}/channels/${channelParam}/chats`, {
        content: savedChat,
      })
      .then((res)=>{
        setChat('');
        mutateChat();
        setTimeout(()=>{scrollbarRef.current?.scrollToBottom();}, 50);
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
      <img src={gravatar.url(meData?.email, { s: '24px', d: 'retro' })} alt={meData?.nickname} />
        <span>{meData?.nickname}</span>
        {/* <span>{socketChnnelMessageData?. !== meData.id && `(me)`}</span> */}
      </Header> 
      <ChannelChatList ref={scrollbarRef}/>
      <CommonChatBox 
        onSubmitForm={onSend} 
        onChangeChat={onChathange} 
        chat={chat}
      />
    </Container>
    </>
  )
}

export default Channel;