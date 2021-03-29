import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import {db,storage} from  "./firebase"
import firebase from "firebase"
import './ImageUpload.css'

const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        // incase you select multiple file it only select first file
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)  // uplaoding
    // access the storage in firebase get a reference to folder (new folder) and we are storing everything inside of it

    // now we need to listen 
        uploadTask.on(
            "state_changed", // asynchronus function
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ....
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL() // to get image link
                  .then(url =>{
                      // post image inside data base
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption, // from state
                        imageUrl : url, //download url 
                        username : username

                    })
                    // after everything is done 
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                  })
            }


        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" classname="imageupload__text" placeholder="Enter a Caption" onChange={event => setCaption(event.target.value) } value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default ImageUpload
