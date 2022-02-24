import React, { Children, FC, useState, VFC, useCallback } from "react";
import loadable from '@loadable/component';

//components 
import Menu from "@components/menu";
// components router 
const Channel = loadable(() => import('@pages/channel'));
const DirectMassege = loadable(() => import('@pages/directMassege'));

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
  WorkspaceWrapper, } from "./style";

// util 
import gravatar from 'gravatar'
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from 'axios';
import { Switch, Route, Redirect } from "react-router";

const WorkSpace:FC = () => {
  const { data : userData, error, mutate } = useSWR('/api/users', fetcher);
  const [isModal, setIsModal] = useState(false);

  console.log(userData);

  const onModal = useCallback(() => {
    setIsModal((prev)=> !prev);
  }, [isModal]);


  const onModalClose = useCallback(() => {
    setIsModal(false);
  }, [isModal]);


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
        isModal && (
        <Menu isModal={isModal} style={{ right: 0, top: 38 }} onModalClose={onModalClose}>
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
      {/* 요기부터!!! */}
      <WorkspaceList> 
        test
      </WorkspaceList>
      <Channels>
        <WorkspaceName>
          wooram
        </WorkspaceName>
        <MenuScroll>MenuScroll</MenuScroll>
      </Channels>
      <Chats>
        {/* {children} */}
        <Switch>
          <Route path={`/workspace/channel`} component={Channel}></Route>
          <Route path={`/workspace/dm`} component={DirectMassege}></Route>
        </Switch>
      </Chats>
    </WorkspaceWrapper>
  </>
  )
}

export default WorkSpace;