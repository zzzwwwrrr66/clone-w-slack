import React, { useCallback, useEffect, useState } from 'react';
//custom hooks
import useInput from '@hooks/useInput';

// styles
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/signup/styles';

// api axios 
import axios from 'axios';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import testFetcher from '@utils/testFetcher';

// router
import { Link, Redirect } from 'react-router-dom';




const Login = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  
  const testData = useSWR('test');
  console.log('login page test data', testData.data)

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  
  // console.log(data);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
        )
        .then((response) => {
          mutate();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if(data === undefined) {
    return (
      <h2>loading...</h2>
    )
  }

  if(data) {
    return (
      <Redirect exact to='/workspace/channel' from='/login'></Redirect>
    )
  }

  return(
    <>
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
    </>
  )
}

export default Login;