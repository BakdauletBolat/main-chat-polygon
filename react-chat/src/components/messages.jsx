// import messagesStore from "../stores/messagesStore";
import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";

const Messages = observer(() =>{

    const endMessageRef = useRef(null);

    const scrollToBottom = () => {
        endMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    scrollToBottom();

    console.log('scrolled');

    const currentUserId = userStore.user.id;
    return (
        <>
         {userStore.activeDialog?.messages.map((item)=>(
            <div key={item.id} className={currentUserId == item.sender ? 'justify-right': ''} style={{
                padding: 5,
                display:'flex'
            }}>
                 <div  style={{
                background: '#f0f2f5',
                padding: 10,
                display:'flex',
                borderRadius:5
            }}>
                <div >{item.text}</div>
               
            </div>
            </div>     
        ))}
       
        <div  style={{paddingBottom: 80}}></div>
        <div ref={endMessageRef}></div>
        </>
       
    )
});

export default Messages;