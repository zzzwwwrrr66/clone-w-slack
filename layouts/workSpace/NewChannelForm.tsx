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


const NewChannelForm:FC<IProps> = ({onModalClose}) => {
  const [newChannelName, onChangeNewChannelName, setNewChannelName] = useInput('');
  const { workspace } = useParams<IParams>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  // const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);

  const onCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(newChannelName && newChannelName.trim()) {

      axios.post(`/api/workspaces/${workspace}/channels`, {name:newChannelName})
      .then((res)=>{
        // mutate('/api/users');
        onModalClose();
        setNewChannelName('');
        revalidateChannel();
      })
      .catch((err)=>{
        console.dir(err);
        toast.error(err.response?.data, { position: 'bottom-center' });
      });
    } else return;
    
    

  }
  return (
    <form onSubmit={onCreateChannel}>
      <Label id="channel">
        <span>Channel Name</span>
        <Input id="channel" value={newChannelName} onChange={onChangeNewChannelName} />
      </Label>
      <Button type="submit">Add Channel</Button>
    </form>
  )
}
export default NewChannelForm;