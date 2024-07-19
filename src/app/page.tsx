"use client";
import Image from "next/image";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { ImagesSlider } from "../components/ui/images-slider";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { IoIosRefresh } from "react-icons/io";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface DataItem {
  id: number;
  status: string;
}
const fetchDataFromAPI = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json() as DataItem[];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default function Home() {
  const [iotData, setIotData] = useState<DataItem[]>([]);
  const [camData, setCamData] = useState<DataItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = [
    "https://plus.unsplash.com/premium_photo-1661902046698-40bba703f396?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const fetchData = async () => {
    try {
      const fetchedIotData = await fetchDataFromAPI('http://localhost:3001/fetchAllIotData');
      setIotData(fetchedIotData);

      const fetchedCamData = await fetchDataFromAPI('http://localhost:3001/fetchAllCamData');
      setCamData(fetchedCamData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const isStatusTrue = (id: number) => {
    return iotData.some(item => item.id === id && item.status === 'true') &&
      camData.some(item => item.id === id && item.status === 'true');
  };
  const orStatusTrue = (id: number) => {
    return iotData.some(item => item.id === id && item.status === 'true') ||
      camData.some(item => item.id === id && item.status === 'true');
  };
  const totalTrueSlots = () => {
    const total = iotData.filter(item => isStatusTrue(item.id)).length;
    return total;
  };
  const totalRaguSlots = () => {
    const total = iotData.filter(item => orStatusTrue(item.id)).length;
    return total;
  };

  return (
    <main className="min-h-screen items-center justify-between">
      <ImagesSlider className="h-[40rem]" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            Selamat Datang <br /> Sistem Monitoring Parkir UPNVJ
          </motion.p>

        </motion.div>
      </ImagesSlider>

      <section className="container my-36 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-600 border-4 border-sky-500 shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold">Ketersediaan Parkir</h2>
            <p className="text-4xl mt-4 text-green-500">{totalTrueSlots()}</p>
          </div>
          <div className="bg-white dark:bg-slate-600 border-4 border-sky-500 shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold">Total Parkir</h2>
            <p className="text-4xl mt-4">4</p>
          </div>
          <div className="bg-white dark:bg-slate-600 border-4 border-sky-500 shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold">Kemungkinan Kosong</h2>
            <p className="text-4xl mt-4 text-red-600">{totalRaguSlots()}</p>
          </div>
        </div>
        <div className="container pt-10 text-l font-bold mb-10 text-center">
          <button className="p-5 backdrop-blur-sm border bg-blue-500 border-emerald-500/20 text-white mx-2 text-center rounded-full relative mt-4 hover:bg-blue-950" onClick={() => setIsModalOpen(true)}>
            Watch Streaming Video
          </button>
          <button className="p-5 backdrop-blur-sm border bg-blue-500 border-emerald-500/20 text-white text-center rounded-full relative mt-4 hover:bg-blue-950" onClick={fetchData}>
            <div className="flex">
              <div>Refresh</div>
              <div className=" px-2 text-2xl"><IoIosRefresh /></div>
            </div>
            <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </div>
      </section>

      <section className="container mb-8 px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Komparasi Parkir</h2>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          {camData.map((item) => (
            <div key={item.id} className={`${isStatusTrue(item.id) ? 'bg-green-400' : orStatusTrue(item.id) ? 'bg-yellow-300' : 'red.300'} h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold`}>
              Slot {item.id}
            </div>
          ))}
        </div>
      </section>
      <section className="container mb-8 px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Sensor IOT Parkir</h2>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          {iotData.map((item) => (
            <div key={item.id} className={`${item.status === 'true' ? 'bg-green-400' : 'bg-red-300'} h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold`}>
              Slot {item.id}
            </div>
          ))}
        </div>
      </section>
      <section className="container mb-8 px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Cam Parkir</h2>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          {camData.map((item) => (
            <div key={item.id} className={`${item.status === 'true' ? 'bg-green-300' : 'bg-red-300'} h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold`}>
              Slot {item.id}
            </div>
          ))}
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Streaming Video</DialogTitle>
          </DialogHeader>
          <div className="w-full max-w-3xl">
            <iframe
              title="Streaming Video"
              src="http://127.0.0.1:3002/video_feed"
              width="100%"
              height="400"
              className="max-w-full"
              style={{ maxWidth: '800px' }}
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
