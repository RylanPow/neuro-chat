import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"

const NewPrompt = () => {

    const [img, setImg] = useState ({
        isLoading: false,
        error:"",
        dbData: {}

    })

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"})
    }, []);

    const add = async () =>{
        const prompt = "Write a story about an AI and magic";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    };

    return (
        <>
        {/* ADD NEW CHAT */}
        {img.isLoading && <div className = ''>Loading...</div>}
        {img.dbData?.filePath && (
            <IKImage 
                urlEndpoint = {import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData?.filePath}
            width = "380"
            />
        )}

        <button onClick={add}>TESTAI</button>


        <div className="endChat" ref={endRef}></div>
            <form className = 'newForm'>
                <Upload setImg = {setImg}/>
                <input id = 'file' type="file" multiple={false} hidden/>
                <input type = 'text' placeholder = 'Ask anything...' />
                <button>
                    <img src = "/arrow.png" alt = '' />
                </button>
            </form> 
       </>
    )
}

export default NewPrompt;