import Sidebar from '../components/Sidebar.jsx';
import Home from './Home.jsx';



const Dashboard = () => {
   return (
    <section className='bg-black text-gray-200 h-screen border-0 w-full'>
      <div className="main w-full h-screen flex px-2 py-1 gap-1 ">
        <Sidebar />
        <Home />   
      </div>
    </section>
  )
}

export default Dashboard