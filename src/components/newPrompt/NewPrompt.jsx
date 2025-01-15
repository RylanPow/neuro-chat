import './newPrompt.css'

const NewPrompt = () => {
    return (
        <>
        <div className="endChat"></div>
            <form className = 'newForm'>
                <label htmlFor='file'>
                    <img src = "/attachment.png" alt = '' />
                </label>
                <input type="file" multiple={false} hidden/>
                <input type = 'text' placeholder = 'Ask anything...' />
                <button>
                    <img src = "/arrow.png" alt = '' />
                </button>
            </form> 
       </>
    )
}

export default NewPrompt;