import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { initSocket } from '../Socket';
import toast from 'react-hot-toast';
import {ACTIONS} from '../Actions'
import Editor from './Editor';

const LANGAUGES = [
  "python3",
  "java",
  "cpp",
  "nodejs",
  "c",
  "ruby",
  "go",
  "scala",
  "bash",
  "sql",
  "pascal",
  "csharp",
  "php",
  "swift",
  "rust",
  "r",
]

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");

  const codeRef = useRef();

  const Location = useLocation();
  const navigate = useNavigate();
  const {roomId} = useParams();

  const socketRef = useRef();
  
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', err => handleErrors(err))
      socketRef.current.on('connect_failed', err => handleErrors(err))
      const handleErrors = err => {
        console.log('Error', err);
        toast.error('Socket connection failed, try again later')
        navigate('/');
      }

      // emit - joining the room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username
      })

      // on - if some user join
      socketRef.current.on(
        ACTIONS.JOINED,
        ({clients, username, socketId}) => {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room`)
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId
          })
        }
      )

      // on - if some user disconnect
      socketRef.current.on(ACTIONS.DISCONNECTED, 
        ({socketId, username}) => {
          toast.success(`${username} left the room`)
          setClients((prev) => {
            return prev.filter(client => client.socketId != socketId)
          })
        } 
      )
    }

    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, [])

  if (!Location.state) {
    return <Navigate to="/" />
  }

  const copyRoomId = async() => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID is copied");
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID")
    }
  }

  const leaveRoom = async () => {
    navigate('/')
  }

  const runCode = async () => {
    // todo: add the logic
  }

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  }
  

  return (
    <div>
      <div>
        <div>
          <img src="https://acciojob.com/src/Navbar/logo.svg" alt="" />
          
          <hr />

          <div>
            <h3>Members</h3>
            <div style={{backgroundColor: "#23486A", padding: "8px 16px"}}>
              {clients.map(client => <p>🟢 {client.username}</p> )}
            </div>
          </div>

          <hr />

          <div>
            <button onClick={copyRoomId}>Copy Room ID</button>
            <button onClick={leaveRoom}>Leave Room</button>
          </div>

          <hr />

          <div>
            <div>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
              >
                {LANGAUGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
          </div>

          <Editor 
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={code => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default EditorPage