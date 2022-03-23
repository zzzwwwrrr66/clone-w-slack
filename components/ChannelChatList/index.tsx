import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';

// websocket 
import useSocket from '@hooks/useSocket';

// router
import { useParams } from 'react-router';

// types 
import {IDM, IUser, IChat} from '@typings/db';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';

// utils
import dayjs from 'dayjs';
import { Scrollbars } from 'react-custom-scrollbars';

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

  const onScroll = useCallback( (values) => {
      if(values.scrollTop === 0 && !isReachingEnd) {
        // setsize 로 이차원배열로 chatData 를 업데이팅
        setSize((prevSize) => prevSize + 1).then(() => {
          // 스크롤 위치 유지
          const current = (scrollRef as React.MutableRefObject<Scrollbars>)?.current;
          if (current) {
            // 지금 스크롤 위치 알아내는 방법 current.getScrollHeight() - values.scrollHeight
            current.scrollTop(current.getScrollHeight() - values.scrollHeight); 
          }
        });
      };
    },
    [scrollRef, chatData],
  )

  const onChatDelete = (id) => () => {
    console.log('onChatDelete', id)
  }

  const chatSections = useDateChat(
    chatData ? 
    ([] as IChat[]).concat(...chatData).flat().reverse() : 
    []
  );
  
  return (
    <ChatZone >
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