import './App.css';
import './home.css'
import './about.css'
import './achieve.css'
import './feed.css'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Home from './components/home';
import About from './components/about';
import Feedback from './components/feedback';
import Achive from './components/achive';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ul id='nav'>
        <li><Link to={'/'}>Home</Link></li>
        <li><Link to={'/about'}>About</Link></li>
        <li><Link to={'/education'}>Achievements</Link></li>
        <li><Link to={'/feedback'}>Feedback</Link></li>
      </ul>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/education' element={<Achive/>}></Route>
        <Route path='/feedback' element={<Feedback/>}></Route>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
