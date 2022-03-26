import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';

// websocket 
import useSocket from '@hooks/useSocket';

// router
import { useParams } from 'react-router';

// types 
import {IDM, IUser, IChat} from '@typings/db';
import useSWR, { useSWRInfinite, mutate } from 'swr';
import fetcher from '@utils/fetcher';

// utils
import dayjs from 'dayjs';
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';

// customHooks 
import useDateChat from '@hooks/useDateChat';

// components 
import CommonChats from '@components/CommonChats'; 

//css 
import { StickyHeader } from './style';
import { ChatZone, Section } from '@components/CommonChats/style';


const ChannelChatList = forwardRef<Scrollbars>(({}, scrollRef) =>{
  const {workspace: workspaceParam, channel: channelParam} = useParams<{workspace: string, channel: string}>()
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspaceParam}/channels/${channelParam}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const [isDrag, setIsDrag] = useState(false);
  const current = (scrollRef as React.MutableRefObject<Scrollbars>)?.current;

  const onScroll = useCallback( (values) => {
      if(values.scrollTop === 0 && !isReachingEnd) {
        // setsize 로 이차원배열로 chatData 를 업데이팅
        setSize((prevSize) => prevSize + 1).then(() => {
          // 스크롤 위치 유지
          if (current) {
            // 지금 스크롤 위치 알아내는 방법 current.getScrollHeight() - values.scrollHeight
            current.scrollTop(current.getScrollHeight() - values.scrollHeight); 
          }
        });
      };
    },
    [scrollRef, chatData],
  )
  // drag and drop update Image S
  const handleIsDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(true);
  },[]);

  const onDrop = useCallback( (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDrag(false);

    const formData = new FormData();
    if(e.dataTransfer.items.length) {
      for(let i = 0;i <  e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      // send a Image S
      axios.post(`api/workspaces/${workspaceParam}/channels/${channelParam}/images`, formData)
      .then(res=> {
        console.log('image update success', res);
        mutateChat();
        current.scrollToBottom();
        setIsDrag(false);
        const time = new Date().getTime().toString();
      })
      .catch(err => console.error(err))
    }
    
  },[current, workspaceParam, channelParam]);
  // drag and drop update Image E

  const chatSections = useDateChat(
    chatData ? 
    ([] as IChat[]).concat(...chatData).flat().reverse() : 
    []
  );
  
  
  return (
    <ChatZone onDragOver={handleIsDrag} onDrop={onDrop}>
    <Scrollbars className={`chatListWrap`} autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {
          Object.entries(chatSections).map(([key, chats]) => {
            return ((
              <div key={key}>
              <Section>
                <StickyHeader><button>{key}</button></StickyHeader>
                {
                  chats.map((chat, i) => {
                    return (((
                      <CommonChats chat={chat} key={i}/>
                    )))
                  })
                }
              </Section>
              </div>
            ))
          })
        }
      </Scrollbars>
    </ChatZone>
  )
});

export default ChannelChatList;