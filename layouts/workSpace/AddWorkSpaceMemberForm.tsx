import React, { FC } from "react";
//types
import {IUser, IChannel} from '@typings/db';
interface IProps {
  onModalClose: ()=>void;
}
interface IParams {
  workspace: string,
}
// css 
import { Button, Input, Label } from '@pages/signup/styles';
// customhooks
import useInput from "@hooks/useInput";
//router
import { useParams } from "react-router";
//utils
import axios from "axios";
import useSWR, {mutate} from "swr";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetcher from '@utils/fetcher';


const AddWorkSpaceMemberForm:FC<IProps> = ({onModalClose}) => {
  const [email, onChangeEmail, setEmail] = useInput('');
  const { workspace } = useParams<IParams>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const { mutate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  // const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);

  const onInviteMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(email && email.trim()) {
      console.log('NewChannelForm', email);

      axios.post(`/api/workspaces/${workspace}/members`, {email})
      .then((res)=>{
        // mutate('/api/users');
        onModalClose();
        setEmail('');
        revalidateMember();
      })
      .catch((err)=>{
        console.dir(err);
        toast.error(err.response?.data, { position: 'bottom-center' });
      });
    } else return;
    
    

  }
  return (
    <form onSubmit={onInviteMember}>
      <Label id="member">
        <span>Invite Member</span>
        <Input id="member" value={email} onChange={onChangeEmail} />
      </Label>
      <Button type="submit">Invite</Button>
    </form>
  )
}
export default AddWorkSpaceMemberForm;