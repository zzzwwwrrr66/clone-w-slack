import React from "react";
import { useState } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

//router
import { useParams } from "react-router";
import { Link } from  "react-router-dom";

//icons 
import { BiCaretDown, BiCaretUp } from "react-icons/bi";

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

  console.log('DM list component', memberListData);

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
            <Link to={`/workspace/${params?.workspace}/dm/${i}`}>
              {v.nickname}
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