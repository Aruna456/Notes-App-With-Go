import { useEffect,useState } from "react";
import axios from "axios";


export const App = () => {
  const[notes,setNotes]=useState([])
  const[title,setTitle]=useState("")
  const[content,setContent]=useState("")
  const [loading,setLoading]=useState(false)

  // Fetch notes on mount
  useEffect(()=>{
    const fetchNotes=async()=>{
      try{
        setLoading(true);
        const res=await axios.get("http://localhost:8080/notes");
        setNotes(res.data);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }
    fetchNotes()
  },[])

  // Add note
  const handleAddNote=async()=>{
    if(!title||!content) return;
    try{
      setLoading(true);
      const res=await axios.post("http://localhost:8080/notes",{
        title,
        content,
      });
      setNotes([...notes,res.data]);
      setTitle("");
      setContent("");
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  } 
   // Delete note 
   const handleDeleteNote=async(id)=>{
      try{
        setLoading(true);
        await axios.delete(`http://localhost:8080/notes/${id}`)
        setNotes(notes.filter((note)=>note.id!==id));
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
   }  
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 mt-20">
            <h1 className="text-3xl font-bold mb-6 text-center">Quick Notes App</h1>
            {/* Add Note form */}
            <div className="flex gap-2 mb-6">
              <input type="text" name="Title" placeholder="Title" className="p-2 flex-1 border rounded-md" value={title} onChange={(e)=>setTitle(e.target.value)}/>
              <input type="text" name="Content" placeholder="Content" className="p-2 flex-1 border rounded-md" value={content} onChange={(e)=>setContent(e.target.value)}/>
            <button className="bg-green-400 text-white px-4 py-2 rounded-md cursor-pointer" onClick={()=>handleAddNote()}>Add</button>
            </div>
            {/* Loading */}
            {loading&& <p className="mb-4 text-center text-gray-500">Loading....</p> }
            {/* Note List */}
            <ul>
                {
                  notes.map((note)=>(
                    <li key={note.id} className="flex gap-2 justify-between mb-4">
                      <div><strong>{note.title}</strong> : {note.content}</div>
                      <button className="cursor-pointer p-2 bg-red-500 text-white" onClick={()=>{handleDeleteNote(note.id)}}>Delete</button>
                    </li>
                  ))
                }
            </ul>
    </div>
  );
}

export default App
