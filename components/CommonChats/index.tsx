import React, { useEffect, useCallback, VFC, useMemo} from 'react';
//api
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

// types 
import { IUser, IDM, IChat } from '@typings/db';
interface IProps {
  chat: IChat | IDM;
  
}
// css , 
import { ChatListWrap, ChatZone, Section, StickyHeader } from './style';

// utils 
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useState } from 'react';

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
const Chats: VFC<IProps> = ({chat}) => {

  const user = 'Sender' in chat ? chat.Sender : chat.User;
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [isDrag, setIsDrag] = useState(false);

  const result = useMemo(
    () =>
      // uploads\\서버주소
      chat.content.startsWith('uploads\\') || chat.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${chat.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          input: chat.content,
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />;
          },
        })
      ),
    [workspace, chat.content],
  );

  const chatCreateAt = useMemo<string>(() => {
    return dayjs(chat.createdAt).format('YYYY-MM-DD')
  }, [workspace, chat.content]);

  // const handleIsDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   console.log('isDrag!');
  //   setIsDrag(true);
  // },[]);

  // const onDrop = useCallback( (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   if(e.dataTransfer.items.length) {
  //     for(let i = 0;i <  e.dataTransfer.items.length; i++) {
  //       if (e.dataTransfer.items[i].kind === 'file') {
  //         formData.append('image', e.dataTransfer.files[i]);
  //         // console.log(formData);
  //         debugger
  //       }
  //     }
  //   }
  //   setIsDrag(false);
  // },[isDrag]);

  return (
    <Section style={{ border: '1px solid red' }} >
      <ChatListWrap>
          <span>{user.nickname} / {user.email} / {chatCreateAt}</span><br />
      </ChatListWrap>
      <div>
        <span>{result}</span>
      </div>
    </Section>
  )
}

export default Chats;