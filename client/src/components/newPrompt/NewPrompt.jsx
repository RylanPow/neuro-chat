import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"
import Markdown from "react-markdown"
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react'


const NewPrompt = ({ data }) => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "H" }],
            },
            {
                role: "model",
                parts: [{ text: "f" }],
            },
        ],
        generationConfig: {
            // maxOutputTokens: 100,
        },
    });

    const endRef = useRef(null);
    const formRef = useRef(null);
    const hasRun = useRef(false); // To handle initial chat message

    const queryClient = useQueryClient();

    // Scroll to the bottom when data, question, answer, or img.dbData changes
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    // Handle initial chat message for new chats
    useEffect(() => {
        if (!hasRun.current && data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true);
            hasRun.current = true;
        }
    }, [data]);

    // Mutation for updating chat
    const updateChatMutation = useMutation({
        mutationFn: async () => {
            const sessionToken = await getToken();
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined,
                }),
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
                setQuestion("");
                setAnswer("");
                setImg({
                    isLoading: false,
                    error: "",
                    dbData: {},
                    aiData: {},
                });
            });
        },
        onError: (err) => {
            console.error("Error updating chat:", err);
        },
    });

    // Function to add a message to the chat
    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        try {
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );

            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            updateChatMutation.mutate();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;
        add(text, false);
    };


    return (
        <>
        {/* ADD NEW CHAT */}
        {img.isLoading && <div className = ''>Loading...</div>}
        {img.dbData?.filePath && (
            <IKImage 
                urlEndpoint = {import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData?.filePath}
            transformation = {[{width: "380"}]}
            />
        )}
        {question && <div className = 'message user'>{question}</div>}
        {answer && <div className = 'message'><Markdown>{answer}</Markdown></div>}


        <div className="endChat" ref={endRef}></div>
            <form className = 'newForm' onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg = {setImg}/>
                <input id = 'file' type="file" multiple={false} hidden/>
                <input type = 'text' name="text" placeholder = 'Ask anything...' />
                <button>
                    <img src = "/arrow.png" alt = '' />
                </button>
            </form> 
       </>
    )
}

export default NewPrompt;