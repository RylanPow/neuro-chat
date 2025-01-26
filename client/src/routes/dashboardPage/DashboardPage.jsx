import './dashboardPage.css'
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


const DashboardPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { getToken, isLoaded, isSignedIn } = useAuth();

    // Mutation for creating a new chat
    const createChatMutation = useMutation({
        mutationFn: async (text) => {
            const sessionToken = await getToken();

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({ text }),
            });
            if (!response.ok) {
                throw new Error("Failed to create chat");
            }
            return response.json();
        },
        onSuccess: (data) => {
            // Invalidate and refetch the userChats query
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            // Navigate to the newly created chat
            navigate(`/dashboard/chats/${data._id}`);
        },
        onError: (error) => {
            console.error("Error creating chat:", error);
            alert("Failed to create chat. Please try again.");
        },
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (!text) return;

        createChatMutation.mutate(text);
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
                        <span>Analyze Images</span>
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