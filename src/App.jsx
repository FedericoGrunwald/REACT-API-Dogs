// import './App.css'
import Dog from './components/dogRandom/Dog'
import { FaPaw } from "react-icons/fa";

function App() {

  return (
    <main className=' bg-blue-300'>
        <div>
      <h1 className='font-bold text-4xl p-5 text-white flex justify-center'>
      <FaPaw className='mr-2'/> DOGS APP  <FaPaw className='ml-2'/>
      </h1>
      <Dog />
      </div>
    </main>
  )
}

export default App
