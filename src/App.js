import React, { useState, useEffect }  from 'react';
import Unity, { UnityContext } from "react-unity-webgl";
import { create } from 'ipfs-http-client';
import { ethers } from "ethers";
import axios from 'axios';




const unityContext = new UnityContext({
  loaderUrl: "/Build/Build3.loader.js",
  dataUrl: "/Build/Build3.data",
  frameworkUrl: "/Build/Build3.framework.js",
  codeUrl: "/Build/Build3.wasm",
})

function useWindowSize() {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerHeight, window.innerWidth]);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize",handleResize)
    }
  },[])
  return size;
}

function App() {
  const [userName, setUserName] = useState("");
  const [id, setId] = useState(" ");
  const [height, width] = useWindowSize();
  //const [twin, setTwin] = useState();
  const [basic, setBasic] = useState([]);
  let ipfs;  
  let twin;
  let d;


  async function data() {
    const b = ipfs.cat(twin.cidn);
    for await (const chunk of b) {
      console.log(new TextDecoder().decode(chunk));
      setBasic(new TextDecoder().decode(chunk));
      d = new TextDecoder().decode(chunk);
    }
    unityContext.send("InformationWindow", "BasicData", d);
  }

  const noti = async () => {
    const res = await axios.get(`http://localhost:8000/send?id=123`)
    twin = res.data;
  }

  useEffect(function () {
    document.body.style.overflow = "hidden";

    ipfs = create('http://127.0.0.1:5001');
    console.log(ipfs);


    const join = async () => { 
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer)
    }
    
    unityContext.on("Show", async function (userName) {
      setUserName(userName);
      if (userName === "Player1") {
          await join();
          console.log(userName)
          Next();
      }
    });
    unityContext.on("Send", async function (id) {
      setId(id);
      console.log(id)
      noti();   
    });


  }, []);

  function Next() {
    unityContext.send("Canvas", "Pause");
  }

useEffect(() => {
  let socket = new WebSocket("ws://localhost:8000/ws")

  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
    socket.send("We are connected")
};

socket.onmessage = (msg) => {
  console.log(twin)
  console.log(msg)
  console.log("hello") 
  unityContext.send("PlayerArmature", "Cancelling");
  data();
}



socket.onerror = error => {
    console.log("Socket Error: ", error);
};


},[])


  return (

       <Unity
        style={{
          height: height,
          width: width,
        }}
        unityContext={unityContext}
      />

  );
}

export default App;
