import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard(){
    const [workspaces, setWorkspaces] = useState([]);
    const [message, setMessage] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(()=>{
        const getWorkspaces = async () => {
            try{
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:9000/api/workspaces",
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if(!response.ok){
                    setMessage(data.message||"Failed to get workspaces");
                    return;
                }
                setWorkspaces(data.workspaces);
            }catch(error){
                console.log("Workspace error:", error);
                setMessage("Unable to connect to server");
            }
        };
        getWorkspaces();
    }, []);

    const createWorkspace = async (e) => {
        e.preventDefault();
        if(!workspaceName.trim()){
            return;
        }
        try{
            setCreating(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:9000/api/workspaces",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: workspaceName,
                    }),
                }
            );
            const data = await response.json();
            if(!response.ok){
                setMessage(
                    data.message||"Failed to create workspace"
                );
                return;
            }
            setWorkspaces((prev)=>[...prev, data.workspace]);
            setWorkspaceName("");
        }catch(error){
            console.log("Create workspace error:", error);
            setMessage("Unable to connect to server");

        }finally{
            setCreating(false);
        }
    };

    return(
        <div>
            <h1>Dashboard</h1>
            {message && <p>{message}</p>}
            <h2>Create Workspace</h2>
            <form onSubmit={createWorkspace}>
                <input
                    type="text"
                    placeholder="Workspace name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                />

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Workspace"}
                </button>
            </form>
            <h2>Your Workspaces</h2>
            {workspaces.length === 0 ? (
                <p>No workspaces yet.</p>
            ) : (
                <ul>
                    {workspaces.map((workspace) => (
                        <li key={workspace._id}>
                        <Link to={`/workspace/${workspace._id}`}>
                        {workspace.name}
                        </Link>
                      </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;