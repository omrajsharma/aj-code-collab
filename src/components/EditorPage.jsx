import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { initSocket } from '../Socket';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions'

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
      
      console.log('inside useeffect');

      const handleErrors = err => {
        console.log('Error', err);
        toast.error('Socket connection failed, try again later')
        navigate('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username
      })
    }
  }, [])

  return (
    <div>EditorPage</div>
  )
}

export default EditorPage