import React, {FC, useEffect} from 'react'

//api
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import testFetcher from '@utils/testFetcher';

// router
import { Link, Redirect } from 'react-router-dom';

//components
import WorkSpace from '@layouts/workSpace';
import ChatBox from '@components/chatBox';

//custom hook
import useInput from '@hooks/useInput';

const DirectMassege:FC = ({children}) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);

  const [chat, changeChat, setChat] = useInput('');

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
      <h1>HI {data?.nickname} DM</h1>
      <ChatBox/>
      
    </>
  )
}

export default DirectMassege;