import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom';
import './css/App.css';
import Register from './Register';
import Login from './Login';
import Protected from './Protected';
import Page404 from './Page404';
import Home from './User/Home';
import Adminindex from './User/Index';
import Userspost from './User/Userspost';
import Edituser from './User/Edituser';
import Chatlist from './User/Chatlist';
import Videogallery from './User/Videogallery'
import { WEBSITE_BASE_URL } from './Constant';
import Chatgpt from './User/Chatgpt';
function App() {
  return (
    <div>
      <BrowserRouter basename={`${WEBSITE_BASE_URL}`}>
        <Routes>
          <Route index path='' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='/user' element={<Protected Component={Adminindex} />}>
            <Route path='home' element={<Protected Component={Home} />} />
            <Route path='edit/:rowid' element={<Protected Component={Edituser} />} />
            <Route path='users-post' element={<Protected Component={Userspost} />} />
            <Route path='video-gallery' element={<Protected Component={Videogallery} />} />
            <Route path='chat-box' element={<Protected Component={Chatlist} />} />
            <Route path='chat-gpt' element={<Protected Component={Chatgpt} />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
