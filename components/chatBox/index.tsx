import React, {FC} from 'react';
import { useState, useRef, useEffect, forwardRef } from 'react';
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
import { Mention, SuggestionDataItem } from 'react-mentions';
import gravatar from 'gravatar';

//types
import { IUser, IChannel, IDM } from '@typings/db';
import Scrollbars from 'react-custom-scrollbars';

//css 
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './style';

// props type
interface IProps {
  chat: string;
  onChathange: (e: any) => void;
  onSend: (e: any) => void;
}

const ChatBox:FC<IProps> = ({onSend, onChathange, chat}) => {
  const params = useParams<{workspace: string, dm: string}>()
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${params?.workspace}/members` : null, fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [textArea, setTextArea] = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onEnter = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend(e);
    }
  }, [chat]);

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  return(
    <ChatArea>
    <Form onSubmit={onSend}>
      <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChathange}
          onKeyPress={onEnter}
          placeholder={`send chat...`}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
          appendSpaceOnAdd
          trigger="@"
          data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
          renderSuggestion={renderSuggestion} 
          />
        </MentionsTextarea>
      <Toolbox>
        <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
      </Toolbox>
    </Form>
    </ChatArea>
  )
};

export default ChatBox;