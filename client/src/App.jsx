import{useEffect,useState} from "react";

function App(){
    const[message, setMessage] = useState("");

    useEffect(()=>{
        const getBackendStatus = async()=>{
            try{
                const response = await fetch("http://localhost:9000/api/health");
                const data=await response.json();
                console.log(data.message)
                setMessage(data.message);
            }catch (error){
                console.log("Error connecting to backend:", error);
            }
        };
        getBackendStatus();
    }, []);

    return (
        <div>
            <h1>Project</h1>
            <p>Backend status:</p>
            <p>{message}</p>
        </div>
    );
}

export default App;