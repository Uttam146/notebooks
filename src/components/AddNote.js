import React,{useContext, useState} from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const {addNote} = context;
  const [note,setNote] = useState({title:"",descrition:"",tag:""});
  const handleClick = (e) =>{
    e.preventDefault();
    addNote(note.title, note.descrition, note.tag);
    setNote({title:"",descrition:"",tag:""});
    props.showAlert("Added successfully","success");
  }
  const onChange = (e) =>{
    setNote({...note,[e.target.name]:e.target.value})
  }
  return (
    <div className='container my-3'>
      <h2>Add a note</h2>
      <form className='my-3'>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp"
          value={note.title} onChange={onChange} minLength={5}  required/>
        </div>
        <div className="form-group">
          <label htmlFor="descrition">Descrition</label>
          <input type="text" className="form-control" name="descrition" id="descrition" 
          value={note.descrition} onChange={onChange} minLength={5} required/>
        </div>
        <div className="form-group">
          <label htmlFor="descrition">Tag</label>
          <input type="text" className="form-control" name="tag" id="tag" 
          value={note.tag} onChange={onChange} minLength={5} required/>
        </div>
        <button disabled={note.title.length<5 || note.descrition.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
      </form>
      </div>
  );
}

export default AddNote;
