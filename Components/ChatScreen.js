import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { Avatar, IconButton } from '@mui/material'
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components'
import { auth, db } from '../firebase'
import Message from './Message';
import { useRef, useState } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
  const [input, setInput] = useState('')
  const [user] = useAuthState(auth)
  const router = useRouter()

  const endOfMessageRef = useRef(null)
  
  const [messagesSnapshot] = useCollection(
    query(collection(
      doc(db, 'chats', router.query.id,), "messages"), 
      orderBy("timestamp", "asc")
      ))

  const [recipientSnapshot] = useCollection(
    query(collection(db, 'users') , 
    where('email' , '==' , getRecipientEmail(chat.users, user))
  ))

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message key={message.id} user={message.user} message={message}/>
      ))
    }
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  const sendMessage = (e) => {
    e.preventDefault()

    setDoc(doc(db, 'users', user.uid), {
      lastSeen: serverTimestamp()
    },
      { merge: true }
    )

    addDoc(collection(doc(db, 'chats', router.query.id,), 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    })

    setInput('')
    scrollToBottom()
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data() 

  const recipientEmail = getRecipientEmail(chat.users, user)

  // console.log(recipient)
  // console.log(recipientSnapshot?.docs?.[0].data());

  return (
    <Container>

      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL}/>
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>

        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>Last active: {' '}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
            ): "Unavailable"}
            </p>
          ) : (
            <p>Loadind Last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        <IconButton>
          <MicIcon />
        </IconButton>
      </InputContainer>

    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
  
`

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: grey;
  }
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;

`

const EndOfMessage = styled.div`
  margin-bottom: 10px;
`

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`

