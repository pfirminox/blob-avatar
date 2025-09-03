"use client"; 

import dynamic from 'next/dynamic';

const App = dynamic(() => import('./App').then(), {
  ssr: false, // Important: disable server-side rendering
});

export default function Home() {
  return (
    <App />
  );
}
