import { collection, doc, getDoc, getDocs, orderBy } from 'firebase/firestore'
import Head from 'next/head'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import ChatScreen from '../../Components/ChatScreen'
import Sidebar from '../../Components/Sidebar'
import { db, auth } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth) 
    // console.log(getRecipientEmail(chat.users, user))
    // console.log(chat, messages);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}


export default Chat

export async function getServerSideProps(context){
    const ref = doc(db, 'chats', context.query.id,)

    // Prep messages on server
    const messagesRef = await getDocs(collection(ref, "messages"), orderBy("timestamp", "asc"))

    const messages = messagesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // Prep the chats
    const chatRes = await getDoc(ref)
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;

`

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`
