import React, { useEffect, VFC } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
// router
import { Link, useParams } from  "react-router-dom";
// styles 
import {IdTxt} from './style';

// types
import { IUser, IChannel,  } from '@typings/db';

interface IProps {
  onlineList: number[],
  user: IUser,
  workspace: string,

}

const EachDmUser:VFC<IProps> = ({onlineList, user, workspace}) => {

  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);

  useEffect(()=>{
    
    return()=> {

    }
  }, []);
  

  return (
    <div >
    <Link to={`/workspace/${workspace}/dm/${user.id}`}>
      <IdTxt className={onlineList.includes(user.id) ? 'active' : ''}>{user.nickname}</IdTxt>
      {
        userData.id === user.id ? (' (me)') : (null)
      }
    </Link>
    </div>
  )
}

export default EachDmUser;