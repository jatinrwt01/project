import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Workspace() {
    const { workspaceId } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(()=>{
        const getWorkspaceData = async()=>{
            try{
                const token = localStorage.getItem("token");
                const workspaceResponse = await fetch(
                    `http://localhost:9000/api/workspaces/${workspaceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const workspaceData = await workspaceResponse.json();
                if(!workspaceResponse.ok){
                    setMessage(
                        workspaceData.message ||
                        "Failed to get workspace"
                    );
                    return;
                }

                setWorkspace(workspaceData.workspace);

                const documentResponse = await fetch(
                    `http://localhost:9000/api/documents/workspace/${workspaceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const documentData = await documentResponse.json();
                if(!documentResponse.ok){
                    setMessage(
                        documentData.message ||
                        "Failed to get documents"
                    );
                    return;
                }

                setDocuments(documentData.documents);

            }catch(error){
                console.log("Workspace error:", error);
                setMessage("Unable to connect to server");
            }
        };
        getWorkspaceData();
    }, [workspaceId]);

    const uploadDocument = async()=>{
        if(!selectedFile){
            setMessage("Please select a file");
            return;
        }
        try{
            setUploading(true);
            setMessage("");
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await fetch(
                `http://localhost:9000/api/documents/${workspaceId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();
            if(!response.ok){
                setMessage(
                    data.message || "Failed to upload document"
                );
                return;
            }

            setDocuments((prev) => [...prev, data.document]);

            setSelectedFile(null);
            setMessage("Document uploaded successfully");

        }catch(error){
            console.log("Upload error:", error);
            setMessage("Unable to connect to server");

        }finally{
            setUploading(false);
        }
    };

    const deleteDocument = async(documentId)=>{
        try{
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:9000/api/documents/${documentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if(!response.ok){
                setMessage(
                    data.message || "Failed to delete document"
                );
                return;
            }

            setDocuments((prev) =>
                prev.filter(
                    (document) => document._id !== documentId
                )
            );

            setMessage("Document deleted successfully");

        }catch(error){
            console.log("Delete error:", error);
            setMessage("Unable to connect to server");
        }
    };

    if(message && !workspace){
        return <p>{message}</p>;
    }
    if(!workspace){
        return <p>Loading workspace...</p>;
    }

    return(
        <div>
            <h1>{workspace.name}</h1>
            <p>Workspace ID: {workspace._id}</p>
            {message && <p>{message}</p>}
            <h2>Upload Document</h2>
            <input
                type="file"
                onChange={(e) =>
                    setSelectedFile(e.target.files[0])
                }
            />
            <button
                onClick={uploadDocument}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            <h2>Documents</h2>

            {documents.length === 0 ? (
                <p>No documents yet.</p>
            ) : (
                <ul>
                    {documents.map((document) => (
                        <li key={document._id}>
                            {document.name}

                            <button
                                onClick={() =>
                                    deleteDocument(document._id)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Workspace;