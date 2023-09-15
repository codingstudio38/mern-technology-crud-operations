import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Register from './Register';
import Login from './Login';
import Protected from './Protected';
import Page404 from './Page404';
import Home from './User/Home';
import Index from './User/Index';
import Userspost from './User/Userspost';
import Edituser from './User/Edituser';
import Chatlist from './User/Chatlist';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path='' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='/user' element={<Protected Component={Index} />}>
            <Route path='home' element={<Protected Component={Home} />} />
            <Route path='edit/:rowid' element={<Protected Component={Edituser} />} />
            <Route path='users-post' element={<Protected Component={Userspost} />} />
            <Route path='chat-box' element={<Protected Component={Chatlist} />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
