import { Button } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { auth, provider } from '../firebase'
import { signInWithPopup } from "firebase/auth"


function Login() {
    const signIn = async () => {
        try {
            return await signInWithPopup(auth, provider)
        } catch (message) {
            return alert(message)
        }
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo
                    src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'
                />
                <LoginButton
                    onClick={signIn}
                    variant='outlined'
                >Sign in with Google</LoginButton>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`

const LoginContainer = styled.div`
    display: flex;
    flex-direction:  column;
    align-items: center;
    padding: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`

const LoginButton = styled(Button)`
    &&&{
        color: green;
    }
`

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`