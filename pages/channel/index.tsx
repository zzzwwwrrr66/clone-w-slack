import React, {FC, useEffect} from 'react'

//api
import axios from 'axios';
import useSWR ,{SWRResponse}from 'swr';
import fetcher from '@utils/fetcher';
import testFetcher from '@utils/testFetcher';

// router
import { Link, Redirect } from 'react-router-dom';

//components
import WorkSpace from '@layouts/workSpace';

const Channel:FC = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  

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
      <h1>HI {data?.nickname} CHANNEL</h1>
    </>
  )
}

export default Channel;