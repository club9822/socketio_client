import React, {useCallback, useEffect, useState} from 'react'

import {Link, useHistory} from "react-router-dom";
import {axios} from '../../utils/axios';
import {getCookie} from "../../utils/cookie";
import {SocketUtil} from "../../utils/socket";


function Page(props) {
  const {socketRef} =props
  let history = useHistory();
  // useEffect(()=>{
  //   console.log(props)
  // },[props])
  const [roomName, setRoomName] = React.useState("");
  const [rooms,setRooms]= useState([]);
  const [groups,setGroups]= useState([]);
  const [allUsers,setAllUsers]= useState([]);
  const [newUser,setNewUser]=useState(null)
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const getAllUsers= ()=>{
    socketRef?.current.emit('allSockets',(sockets)=>{
      alert(JSON.stringify(sockets))
      console.log(sockets)
      setNewUser(sockets)
    })
  }
  useEffect(()=>{
    console.log(socketRef.current)
    if(socketRef && socketRef.current){
      console.log(socketRef.current)
       socketRef?.current.emit('allRooms',(e,rooms)=>{
         setRooms(rooms)
       })
      //  socketRef?.current.on('connect',(msg)=>{
      //    console.log(msg)
      //    setNewUser(msg)
      //   setTimeout(()=>{
      //     setNewUser(null)
      //   },3000)
      // })
      getAllUsers()

    }
  },[socketRef])
  const joinToGroup=()=>{

  }
  useEffect(()=>{
    getAllGroups()
  },[])
  const getAllGroups= async ()=>{
    try{
      const response= await axios({method:'get',url:'db/group'})
      setGroups(response.data)
    }catch (e){

    }
  }
  useEffect(()=>{
    const username= getCookie('username')
    if(username){
      socketRef.current=SocketUtil.init(username)
    }else {
      history.push('/login')
    }
  },[])
  return (
    <div>
      <p>
        all rooms : include users
      </p>
      <div style={{flexDirection:'column',display:'flex'}}>
      {
        rooms.map(room=>{
          return (<Link to={{pathname:`/${room}`,search:'?userId=sss'}} className="enter-room-button" key={room}>room: {room||''}</Link>)
        })
      }
      </div>
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className="text-input-field"
      />
      <Link to={{pathname:`/${roomName}`,search:'?userId=sss'}} className="enter-room-button">
        Create New room
      </Link>

      <hr />
      <p>
        groups
      </p>
      <div style={{flexDirection:'column',display:'flex'}}>
        {
          groups.map(group=>{
            return (<Link to={{pathname:`/${group?.id}`,search:'?userId=x'}} className="enter-room-button" key={group.id} onClick={()=>{

            }}> {group.name||''}</Link>)
          })
        }
      </div>
      <div style={{position:'absolute',right:0,top:0,backgroundColor:'#e1f1ed',flexDirection:'column',display:'flex'}}>
        <h1>All Online users</h1>
        <div>
          {newUser?newUser?.message:''}
        </div>
        {
          allUsers.map(user=>(<Link key={user+'_'} to={{pathname:`/pv/${user}`,search:'?userId=sss'}} className="enter-room-button">
            {user||''}
          </Link>))
        }
      </div>
    </div>
  );
}

export default Page;
