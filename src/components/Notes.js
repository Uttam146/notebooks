import React, { useContext, useEffect, useRef, useState } from 'react';
import Noteitem from "./Noteitem";
import AddNote from './AddNote';
import noteContext from "../context/notes/noteContext";
import { useNavigate } from 'react-router';
import { propTypes } from 'react-bootstrap/esm/Image';
const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate = useNavigate();
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    }
    else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [])
  const ref = useRef(null);
  const closeref = useRef(null);
  const [note, setNote] = useState({ etitle: "", edescrition: "", etag: "" });
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescrition: currentNote.descrition, etag: currentNote.tag });
  }
  const handleClick = (e) => {
    console.log("Updating the note", note);
    editNote(note.id, note.etitle, note.edescrition, note.etag);
    closeref.current.click();
    props.showAlert("Updated successfully", "success");
  }
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" value={note.etitle} className="form-control" id="eetitle" name="etitle" aria-describedby="emailHelp"
                    onChange={onChange} minLength={5} required />
                </div>
                <div className="form-group">
                  <label htmlFor="descrition">Descrition</label>
                  <input type="text" value={note.edescrition} className="form-control" name="edescrition" id="edescrition"
                    onChange={onChange} minLength={5} required />
                </div>
                <div className="form-group">
                  <label htmlFor="descrition">Tag</label>
                  <input type="text" value={note.etag} className="form-control" name="etag" id="etag"
                    onChange={onChange} minLength={5} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={closeref} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescrition.length < 5} type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <h2>Your Notes</h2>
      <div className='row my-3'>
        <div className='container'>
          {notes.length === 0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return <Noteitem showAlert={props.showAlert} showkey={note._id} updateNote={updateNote} note={note} />
        })}
      </div>
    </>
  );
}

export default Notes;