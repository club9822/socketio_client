import React, {useEffect, useState} from 'react'
import useChat from "./useChat";
import {Link} from "react-router-dom";
import {getCookie} from "../../utils/cookie";


function Page(props) {
  const username= getCookie('username')||''
  // console.log(props)
  const {socketRef}=props
  const { roomId,} = props.match.params; // Gets roomId from URL
  const { messages, sendMessage } = useChat(roomId,socketRef); // Creates a websocket and manages messaging
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent
  const [newUserJoined,setNewUserJoined]=useState(null);
  const [userLeave,setUserLeave]=useState(null);
  const [onlineUsers,setOnlineUsers] = useState([])
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };
  const leaveRoom= ()=>{
    socketRef?.current.emit('leaveRoom' ,{userId:socketRef?.current?.id+'',roomId:roomId,},(e,result) => {
      console.log('leaveRoom=>>>>>>',e,result)
    })
  }
  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };
  const getALlSocketsInRoom=()=>{
    socketRef?.current.emit('allSocketsInRoom' ,{roomId:roomId},(e,users) => {
      console.log('allSocketsInRoom=>>>>>>',e,users)
      setOnlineUsers(users)
    })
  }
  useEffect(()=>{
      getALlSocketsInRoom()
      socketRef?.current.on('_user_join' ,(msg) => {
        setNewUserJoined(msg)
        setTimeout(()=>{
          setNewUserJoined(null)
        },3000)
        getALlSocketsInRoom()
      })
      socketRef?.current.on('_user_leave' ,(msg) => {
        setUserLeave(msg)
        setTimeout(()=>{
          setUserLeave(null)
        },3000)
        getALlSocketsInRoom()
      })
    }
  ,[socketRef])
  return (
    <div>
      <div className="chat-room-container">
        <Link to={{pathname:`/`}} onClick={leaveRoom} >
         Exit room
        </Link>
        <h3 className="room-name">Room: {roomId}</h3>
        <h3 className="room-name">username: {username}</h3>
        <div>
          {newUserJoined?<p>{newUserJoined?.username||''} joined group</p>:null }
        </div>
        <div>
          {userLeave?<p>{userLeave?.message||''}</p>:null }
        </div>
        <div className="messages-container">
          <ol className="messages-list">
            {messages.map((message, i) => (
              <li
                key={i}
                className={`message-item ${
                  message.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
              >
                {message.body}
              </li>
            ))}
          </ol>
        </div>
        <textarea
          value={newMessage}
          onChange={handleNewMessageChange}
          placeholder="Write message..."
          className="new-message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button">
          Send
        </button>
      </div>
      <div style={{position:'absolute',right:0,top:0,backgroundColor:'#e1f1ed',flexDirection:'column',display:'flex'}}>
        <h1>Online users in this Room</h1>
        {
          onlineUsers.map(user=>(<Link key={user+'_'} to={{pathname:`/${'roomName'}`,search:'?userId=sss'}} className="enter-room-button">
            {user||''}
          </Link>))
        }
      </div>
    </div>
  );
}

export default Page;
