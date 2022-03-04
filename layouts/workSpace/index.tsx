import React, { Children, FC, useState, VFC, useCallback, useEffect } from "react";

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
  RightCenterButton 
} from "./style";
import { Button, Input, Label } from '@pages/signup/styles';
// ico
import { BsThreeDotsVertical, BsFillCaretDownFill } from "react-icons/bs";


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
import AddMemberForm from '@layouts/workSpace/AddWorkSpaceMemberForm'
import ChannelList from "@components/channelList";
import DmList from "@components/dmList";

//router
import { Switch, Route, Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";

//websocket
import useSocket from '@hooks/useSocket';

const WorkSpace:FC = () => {
  const params = useParams<IParams>();
  const [socket, disconnect] = useSocket(params?.workspace);

  const { data : userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data : channelData, error:channelDataError, mutate: channelDataMutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${params?.workspace}/channels` : null,
  fetcher);
  const { data: memberListData, mutate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${params?.workspace}/members` : null,
    fetcher,
  );

  const [isProfileModal, setIsProfileModal] = useState(false);
  const [isAddWorkSpaceModal, setIsAddWorkSpaceModal] = useState(false);
  const [isAddChannelModal, setIsAddChannelModal] = useState(false);
  const [isOptionModal, setIsOptionModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  useEffect(() => {
    if (channelData && userData && socket) {
      console.log(socket);
      socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
      
    }
  }, [socket, channelData, userData]);


  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [params?.workspace, disconnect]);

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

  const onIsOptionModal = useCallback(() => {
    setIsOptionModal((prev)=> !prev);
  }, []);
  const onIsOptionModalClose = useCallback(() => {
    setIsOptionModal(false);
  }, []);

  const setCloseAllModal = () => {
    setIsOptionModal(false);
    setIsAddChannelModal(false);
    setIsAddWorkSpaceModal(false);
    setShowInviteWorkspaceModal(false);
  }

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
        <WorkspaceName onClick={onIsOptionModal}>
          <span>CN: {userData?.Workspaces.find((v) => v.url === params?.workspace)?.name}</span>
          {/* <RightCenterButton as='span'> */}
            <BsFillCaretDownFill />
          {/* </RightCenterButton> */}
          </WorkspaceName>
          {
            isOptionModal && (
              <Menu onModalClose={onIsOptionModalClose} style={{ top: '100px',left:'7px'}}>
                <WorkspaceModal>
                  <h2>{userData?.Workspaces.find((v) => v.url === params?.workspace)?.name}</h2>
                  <button onClick={()=>setIsAddChannelModal(true)}>채널 만들기</button>
                  <button onClick={()=>setShowInviteWorkspaceModal(true)}>{userData?.Workspaces.find((v) => v.url === params?.workspace)?.name} 워크스페이스에 사용자 초대</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
            )
          }

        <MenuScroll>
          <ChannelList/>
          <DmList/>
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
        <Modal onModalClose={setCloseAllModal}>
          <NewChannelForm onModalClose={setCloseAllModal}/>
        </Modal>
      )
    }
    {
      showInviteWorkspaceModal && (
        <Modal onModalClose={setCloseAllModal}>
          <AddMemberForm onModalClose={setCloseAllModal}/>
        </Modal>
      )
    }
    
  </>
  )
}

export default WorkSpace;