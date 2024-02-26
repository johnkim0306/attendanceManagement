'use client'
import { useSession } from 'next-auth/react';

export default function Home() {
  const {data:session, status} = useSession();

  if(status != 'loading' && !session?.user){
    window.location.href = '/login';
  }

  const handleCheckIn = async () => {
    //Call checkin api
  };

  const handleCheckOut = async () => {
    //Call checkout api
  };


  return (
    <div>
      <button onClick={handleCheckIn}>Check In</button>
      <button onClick={handleCheckOut}>Check Out</button>
    </div>
  );
}
