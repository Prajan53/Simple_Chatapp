import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [ messages, setMessages ] = useState(["hi there"]);
  const inputRef = useRef();
  const wsRef = useRef<WebSocket>();

  function sendMessage(){
    if(!wsRef){
      return
    }
    const message = inputRef.current.value;
    const sendMessage = {
      "type": "chat",
      "payload": {
        "message": message
      }
    }
    wsRef.current.send(JSON.stringify(sendMessage));
    inputRef.current.value = '';
  }
  
  
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }

    const joinMessage = ({
      "type": "join",
      "payload": {
        "roomId": "red"
      }
    })
    ws.onopen= () => {
      ws.send(JSON.stringify(joinMessage));
    }
    
    return () => {
      ws.close();
    }
  }, []);

  return (
    <div className='bg-black h-screen'>
      <br />
      <div className='h-[85vh]'>
        {messages.map(message => <div className='m-8'>
          <span className='bg-white rounded p-2 text-black'>
            {message}
          </span>
        </div>)}
      </div>
      <div className='bg-white w-full'>
        <input ref={inputRef} type="text" className='w-[93vw] items-center p-2' placeholder='Message...' />
        <button onClick={sendMessage} className='items-center bg-purple-600 text-white rounded px-4 py-2'>Send</button>
      </div>
    </div>
  )
}

export default App
