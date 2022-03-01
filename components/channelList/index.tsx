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
import { useState } from "react";

//icons 
import { BiCaretDown, BiCaretUp } from "react-icons/bi";

const ChannelList = () => {
  const params = useParams<IParams>();
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data : channelData, error:channelDataError, mutate: channelDataMutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${params?.workspace}/channels` : null,
  fetcher);
  const [isOpen, setIsOpen] = useState(true);

  console.log('channel list component', channelData);

  const handleIsOpen = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <>
    <div onClick={handleIsOpen} style={{cursor: 'pointer'}}>Channel List
      {
        isOpen ? (
          <BiCaretUp style={{verticalAlign:'middle'}}/>
          ) : (
          <BiCaretDown style={{verticalAlign:'middle'}}/>
        )
      }
    </div>
    {
    isOpen ? (
      <div>
      {channelData?.map((v, i)=>{
        return (
          <div key={v.id}>
          <Link to={`/workspace/${params?.workspace}/channel/${v.name}`}>
            {v.name}
          </Link>
          </div>
        )
      })}
      </div>
      ) : null
    }
    </>  
  )
}
export default ChannelList;