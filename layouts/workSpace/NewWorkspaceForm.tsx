import React, { FC } from "react";
//types
import {IUser} from '@typings/db';
interface IProps {
  onModalClose: ()=>void;
}
// css 
import { Button, Input, Label } from '@pages/signup/styles';
// customhooks
import useInput from "@hooks/useInput";
//utils
import axios from "axios";
import useSWR, {mutate} from "swr";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewWorkspaceForm:FC<IProps> = ({onModalClose}) => {
  const [newWorkspace, onChangeNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl] = useInput('');
  // const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);

  const onCreateWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(newWorkspace && newWorkspace.trim() && newUrl && newUrl.trim()) {

      axios.post('/api/workspaces', {workspace:newWorkspace, url:newUrl})
      .then((res)=>{
        mutate('/api/users');
        onModalClose();
        onChangeNewWorkspace('');
        onChangeNewUrl('');
      })
      .catch((err)=>{
        console.dir(err);
        toast.error(err.response?.data, { position: 'bottom-center' });
      });
    } else return;
    
    

  }
  return (
    <form onSubmit={onCreateWorkspace}>
      <Label id="workspace-label">
        <span>워크스페이스 이름</span>
        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
      </Label>
      <Label id="workspace-url-label">
        <span>워크스페이스 url</span>
        <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
      </Label>
      <Button type="submit">생성하기</Button>
    </form>
  )
}
export default NewWorkspaceForm;