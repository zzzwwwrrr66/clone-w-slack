import React, { useEffect, useCallback, VFC } from 'react';
//api
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

// types 
import { IUser, IDM } from '@typings/db';
interface IProps {
  chat: IDM;
}
// css 
import { ChatListWrap, ChatZone, Section, StickyHeader } from './style';


const Chats: VFC<IProps> = ({chat}) => {

  return (
    <Section style={{ border: '1px solid' }}>
      <ChatListWrap>
          <span>{chat.Sender.nickname}</span><br />
          <span>{chat.createdAt}</span>
      </ChatListWrap>
      <div>
        <span>{chat.content}</span>

      </div>
    </Section>
  )
}

export default Chats;