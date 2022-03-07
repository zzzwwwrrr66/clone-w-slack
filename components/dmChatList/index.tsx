import React, { useEffect, useRef, useState, useCallback } from 'react';

// websocket 
import useSocket from '@hooks/useSocket';

// router
import { useParams } from 'react-router';

// types 
import {IDM, IUser, IChat} from '@typings/db';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';

// css 
import { ChatListWrap } from './style';

// utils
import dayjs from 'dayjs';
import { Scrollbars } from 'react-custom-scrollbars';

// customHooks 
import useDateChat from '@hooks/useDateChat';

const DmChatList = () => {
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const {workspace: workspaceParam, dm: dmParam} = useParams<{workspace: string, dm: string}>()
  // const [socket] = useSocket(workspaceParam);
  // const [chatList, setChatList] = useState<IDM>();
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspaceParam}/dms/${dmParam}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  const scrollBarsRef = useRef(null)

  useEffect(() => {
    if(scrollBarsRef) console.log(scrollBarsRef.current);
    return () => {
    }
  }, [scrollBarsRef]);

  const onScroll = useCallback(
    (e) => {
    },
    [scrollBarsRef],
  )

  const onChatDelete = (id) => () => {
    console.log('onChatDelete', id)
  }

  
  return (
    <Scrollbars className={`chatListWrap`} autoHide ref={scrollBarsRef} onScroll={onScroll}>
    {
      chatData && chatData?.[0].reverse().map(v=> {
        return (
          <div style={{border: '1px solid'}}>
            <ChatListWrap>
            <div>
              <span>{v.Sender.nickname}</span><br/>
              <span>{v.createdAt}</span>
            </div>
            {
              userData.id === v.SenderId && <div><button onClick={onChatDelete(v.id)}>Delete</button></div>
            }
            </ChatListWrap>
            <div>
              <span>{v.content}</span>
              
            </div>
          </div>
        )
      })
    }
    </Scrollbars>
  )
}

export default DmChatList;