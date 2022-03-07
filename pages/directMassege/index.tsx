import React, {FC, useEffect} from 'react'

//api
import axios from 'axios';
import useSWR from 'swr';
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

const DirectMassege:FC = ({children}) => {
  const {workspace: workspaceParam, dm: dmParam} = useParams<{workspace: string, dm: string}>()
  const { data:meData, error:meError, mutate: meMutate } = useSWR('/api/users', fetcher);

  const [chat, changeChat, setChat] = useInput('');
  const {data: currectUserData} = useSWR<IUser>(`/api/workspaces/${workspaceParam}/users/${dmParam}`)

  console.log(`Page DirectMassege, `,currectUserData, 'meData',  meData)

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
    <Container>
      <Header>
      <img src={gravatar.url(currectUserData?.email, { s: '24px', d: 'retro' })} alt={currectUserData?.nickname} />
        <span>{currectUserData?.nickname}</span>
        <span>{currectUserData?.id === meData?.id && `(me)`}</span>
      </Header> 
      <DmChatList/>
      <ChatBox/>
    </Container>
  )
}

export default DirectMassege;