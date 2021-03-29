import React, { useState, useEffect } from 'react'
import './App.css'
import { db, auth } from './firebase'
import Post from './Post'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Input } from '@material-ui/core'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'

// stling for modal
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false) // a state to track of mordal is open

  const classes = useStyles(); // tp get access to classes using makestyle hook and usestyle parameter
  const [modalStyle] = React.useState(getModalStyle);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [user, setUser] = useState(null) // to keep track of user

  const [opensignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has looged in ...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has looged out ...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup action
      unsubscribe();
    }
    // this is going to listen any single time any authentication changes it fires
  }, [user, username])


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
      // every time a new post add this code fire
      setPosts(snapshot.docs.map(doc =>
        // (doc.data()))
        ({ id: doc.id, post: doc.data() }))
      )
    ))
  })

  const signUp = (event) => {
    event.preventDefault();
    // user authentication      // email password are from state
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false) // for closing modal after signup

  }
  const signIn = (event) => {
    event.preventDefault();
    setEmail('')
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }


  return (
    <div className="app">

      <Modal
        open={open} // state for opening
        onClose={() => setOpen(false)} // an inline function to close modal
      >
        {/* {body} */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}

            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>

        </div>
      </Modal>
      <Modal
        open={opensignIn} // state for opening
        onClose={() => setOpenSignIn(false)} // an inline function to close modal
      >
        {/* {body} */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
          src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) :
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        }
      </div>
      <div className="app__posts">
        <div className="app__postLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
              // we use key so it rerender old post 
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://www.instagram.com/reel/CJoEKuMhdgO/?igshid=1swl2hvstkxwu'
            // url='https://www.instagram.com/p/B-uf9dmAGPw/'
            // url='https://instagr.am/p/Zw9o4/'
            // clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>


      {/* <Post username="Sidhant" caption="I love Dogs" imageUrl="https://images..." /> */}
      {
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) :
          (
            <h3> Soory You Need To Login To Upload</h3> // if user not login
          )
      }

    </div>
  )
}

export default App



