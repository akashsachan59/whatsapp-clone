import { Avatar, Button, IconButton } from '@mui/material'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from './Chat';
import { useState } from 'react';

function Sidebar() {

    const [input, setInput] = useState('')

    const [user] = useAuthState(auth)
    const userChatRef = query(collection(db, "chats"), where("users", "array-contains", user.email))
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () => {
        const input = prompt(
            "Please enter an email for the user you wish to chat with!"
        )

        if (!input) return null

        if (EmailValidator.validate(input) && !chatAlreadyExist(input) && input !== user.email) {
            // Add chat into DB chats collection if it doesn't already exist and is valid
            addDoc(collection(db, 'chats'), {
                users: [user.email, input],
            })

        }
    }
 
    const chatAlreadyExist = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0)
    
    // console.log(chatsSnapshot?.docs);
    return (
        <Container>
            <Header>
                <UserAvatar src={user?.photoURL} onClick={() => auth.signOut()}/>

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon />
                <SearchInput placeholder='Search in chats' />
            </Search>

            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {/* List of Chats */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius:  2px;
`
const SidebarButton = styled(Button)`
    width: 100%;
    &&&{
        color: black;
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`

const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }
`

const IconsContainer = styled.div`
    
`