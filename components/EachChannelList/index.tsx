import React, { useEffect, VFC } from "react";
// router
import { Link, useParams } from  "react-router-dom";
// styles 
import {IdTxt} from './style';

import useSWR from "swr";
import fetcher from '@utils/fetcher';
import {IUser, IChannel} from '@typings/db';



interface IParams {
  workspace: string,
  channel: string,
}

interface IProps {
  channel: IChannel
}

const EachChannelList:VFC<IProps> = ({channel}) => {
  const {workspace: workspaceParam, channel: channelParam} = useParams<{workspace: string, channel: string}>()
  const time = localStorage.getItem(`${workspaceParam}-${channel.name}`);
 
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspaceParam}/channels/${channel.name}/unreads?after=${time}` : null,
    fetcher,
  );


  return (
    <div>
      <Link to={`/workspace/${workspaceParam}/channel/${channel.name}`}>
        {channel.name} unread: ({count})
      </Link>
    </div>
    
  )
}

export default EachChannelList;