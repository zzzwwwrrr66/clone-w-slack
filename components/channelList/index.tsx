import React from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

//router
import { useParams} from "react-router";
import { Link } from "react-router-dom";

interface IParams {
  workspace: string,
}

//types
import { IUser, IChannel } from '@typings/db';

const ChannelList = () => {
  const params = useParams<IParams>();
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data : channelData, error:channelDataError, mutate: channelDataMutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${params?.workspace}/channels` : null,
  fetcher);

  console.log('channel list component', channelData);

  return (
    <>
    {channelData?.map((v, i)=>{
      return (
        <div key={v.id}>
        <Link to={`/workspace/${params?.workspace}/channel/${v.name}`}>
          {v.name}
        </Link>
        </div>
      )
    })}
    </>  
  )
}
export default ChannelList;