import React, { Children, FC, useState, VFC, useCallback } from "react";

//types
import {IUser, IChannel} from '@typings/db';
interface IParams {
  workspace: string,
}



//css 
import { 
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  WorkspaceList,
  WorkspaceWrapper, 
} from "./style";


  // util 
import loadable from '@loadable/component';
import gravatar from 'gravatar'
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from 'axios';

// components router 
const Channel = loadable(() => import('@pages/channel'));
const DirectMassege = loadable(() => import('@pages/directMassege'));

//components 
import Menu from "@components/menu";
import Modal from "@components/modal";
import NewWorkspaceForm from '@layouts/workSpace/NewWorkspaceForm';
import NewChannelForm from '@layouts/workSpace/NewChannelForm';
import ChannelList from "@components/channelList";

//router
import { Switch, Route, Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";


const WorkSpace:FC = () => {
  const params = useParams<IParams>();
  console.log(params?.workspace);
  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data : channelData, error:channelDataError, mutate: channelDataMutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${params?.workspace}/channels` : null,
  fetcher);
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [isAddWorkSpaceModal, setIsAddWorkSpaceModal] = useState(false);
  const [isAddChannelModal, setIsAddChannelModal] = useState(false);

  console.log('WorkSpace', channelData);

  const onModal = useCallback(() => {
    setIsProfileModal((prev)=> !prev);
  }, []);
  const onModalClose = useCallback(() => {
    setIsProfileModal(false);
  }, []);

  const onIsAddWorkSpaceModal = useCallback(()=>{
    setIsAddWorkSpaceModal((prev)=> !prev);
  },[]);
  const onIsAddWorkSpaceModalClose = useCallback(() => {
    setIsAddWorkSpaceModal(false);
  }, []);

  const onIsAddChannelModal = useCallback(() => {
    setIsAddChannelModal((prev)=> !prev);
  }, []);
  const onIsAddChannelModalClose = useCallback(() => {
    setIsAddChannelModal(false);
  }, []);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    })
    .then((res)=>{
      console.log('channel page', res)
      mutate();
    })
    .catch(err=>{
      console.log(err.responce);
    })
  }, [userData]);

  const onAddChannel = () => {
    
  }


  if(!userData) {
    return <Redirect to={`/login`}></Redirect>
  }
  
  return (
  <>
    <Header>
      <RightMenu>
        <span onClick={onModal} style={{cursor:'pointer'}}>
          <ProfileImg src={gravatar.url(userData?.email, { s: '28px', d: 'retro' })} alt={userData?.nickname} />
        </span>
      </RightMenu>
      {
        isProfileModal && (
        <Menu isModal={isProfileModal} style={{ right: 0, top: 38 }} onModalClose={onModalClose}>
          <ProfileModal>
            <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
            <div>
              <span id="profile-name">{userData.nickname}</span>
              <span id="profile-active">Active</span>
            </div>
          </ProfileModal>
          <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
        </Menu>
        )
      }
    </Header>
    <WorkspaceWrapper>
      <WorkspaceList> 
      {userData?.Workspaces.map((ws) => {
        return (
          <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
            <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
          </Link>
        );
      })}
      <AddButton onClick={onIsAddWorkSpaceModal}>+</AddButton>
      </WorkspaceList>
      <Channels>
        <WorkspaceName>
          <span>CN: {userData?.Workspaces.find((v) => v.url === params?.workspace)?.name}</span>
          <AddButton onClick={onIsAddChannelModal}>+</AddButton>
        </WorkspaceName>

        <MenuScroll>
          {/* api channel S */}
          <ChannelList/>
          {/* api channel E */}
        </MenuScroll>
      </Channels>
      <Chats>
        {/* {children} */}
        <Switch>
          <Route path={`/workspace/:workspace/channel/:channel`} component={Channel}></Route>
          <Route path={`/workspace/:workspace/dm/:dm`} component={DirectMassege}></Route>
        </Switch>
      </Chats>
    </WorkspaceWrapper>
    {
      isAddWorkSpaceModal && (
        <Modal onModalClose={onIsAddWorkSpaceModalClose}>
          <NewWorkspaceForm onModalClose={onIsAddWorkSpaceModalClose}/>
        </Modal>
      )
    }
    {
      isAddChannelModal && (
        <Modal onModalClose={onIsAddChannelModalClose}>
          <NewChannelForm onModalClose={onIsAddChannelModalClose}/>
        </Modal>
      )
    }
  </>
  )
}

export default WorkSpace;