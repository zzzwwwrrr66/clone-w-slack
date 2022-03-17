import React from "react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

//router
import { useParams } from "react-router";
import { Link } from  "react-router-dom";

//icons 
import { BiCaretDown, BiCaretUp } from "react-icons/bi";

//utils 
import useSocket from '@hooks/useSocket';

// styles 
import {IdTxt} from './style';

interface IParams {
  workspace: string,
}

//types
import { IUser, IChannel,  } from '@typings/db';

const DmList = () => {
  const params = useParams<IParams>();
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberListData, mutate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${params?.workspace}/members` : null,
    fetcher,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const [socket] = useSocket(params?.workspace);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    // socket?.on('dm', onMessage);
    // console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // socket?.off('dm', onMessage);
      // console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);
 


  const handleIsOpen = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <>
    <div onClick={handleIsOpen} style={{cursor: 'pointer'}}>DM List
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
        {memberListData?.map((v, i)=>{
          return (
            <div key={v.id}>
            <Link to={`/workspace/${params?.workspace}/dm/${v.id}`}>
              <IdTxt className={onlineList.includes(v.id) ? 'active' : ''}>{v.nickname}</IdTxt>
              {
                userData.id === v.id ? (' (me)') : (null)
              }
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
export default DmList;