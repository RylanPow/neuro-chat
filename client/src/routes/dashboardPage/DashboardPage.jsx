import './dashboardPage.css'
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (text) => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }).then(res => res.json());
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ['userChats']});
            navigate(`/dashboard/chats/${id}`);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value ;
        if (!text) return;

        mutation.mutate(text);

        // await fetch("http://localhost:3000/api/chats", {
        //     method: "POST",
        //     credentials: "include",
        //     headers: {
        //         "Content-Type" : "application/json",
        //     },
        //     body: JSON.stringify({  text })
        // });
    };

    return (
        <div className="dashboardPage">
            <div className="texts">
                <div className="logo">
                    <img src='/logo.png' alt = "" />
                    <h1>NeuroChat</h1>
                </div>
                <div className = 'options'>
                    <div className="option">
                        <img src='/chat.png' alt = ""/>
                        <span>Create a New Chat</span>
                    </div>
                    <div className = 'option'>
                        <img src = '/image.png' alt = ''/>
                        <span>Create a New Chat</span>
                    </div>
                    <div className = 'option'>
                        <img src = "/code.png" alt = ""/>
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit = {handleSubmit}>
                    <input type = 'text' name = "text" placeholder = 'Ask me anything!' />
                        <button>
                            <img src = 'arrow.png' alt = '' />
                        </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage