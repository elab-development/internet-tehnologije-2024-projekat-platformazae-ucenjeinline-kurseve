import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <main className='h-screen w-full flex flex-col justify-center items-center bg-slate-100'>
      <h1 className='text-9xl font-extrabold text-black tracking-widest'>
        404
      </h1>
      <div className='bg-gray-300 px-2 text-sm rounded rotate-12 absolute'>
        Page Not Found
      </div>
      <Link
        to={'/'}
        className='mt-5 relative inline-block text-sm font-medium text-black group active:text-black focus:outline-none focus:ring'
      >
        <Button className=' px-8 py-3 bg-black border border-current'>
          Return Home
        </Button>
      </Link>
    </main>
  );
};

export default NotFound;
