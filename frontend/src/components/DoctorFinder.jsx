import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, CalendarPlus } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const DoctorFinder = ({ initialSpecialty = '' }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [city, setCity] = useState('');
  const [rating, setRating] = useState('');
  const [search, setSearch] = useState('');
  
  const [bookingDoc, setBookingDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = '/doctors?';
        if (search) query += `search=${encodeURIComponent(search)}&`;
        if (specialty) query += `specialty=${encodeURIComponent(specialty)}&`;
        if (city) query += `city=${encodeURIComponent(city)}&`;
        if (rating) query += `rating=${encodeURIComponent(rating)}&`;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specialty]);

  useEffect(() => {
    const handleSpecialist = (e) => setSpecialty(e.detail);
    window.addEventListener('find-specialist', handleSpecialist);
    return () => window.removeEventListener('find-specialist', handleSpecialist);
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingDate) return toast.error('Please select a date');
    try {
      await api.post('/appointments', {
        doctorId: bookingDoc._id,
        date: bookingDate,
        reason: 'General Consultation'
      });
      toast.success('Appointment Booked Successfully!');
      setBookingDoc(null);
      // Trigger timeline refresh
      window.dispatchEvent(new Event('refresh-timeline'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 focus:border-[#10b981] outline-none transition-colors"
          />
        </div>
        <select 
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#10b981] outline-none appearance-none text-white"
        >
          <option value="">All Specialties</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Pulmonologist">Pulmonologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="General Physician">General Physician</option>
        </select>
        <div className="flex gap-4">
          <select 
            value={city}
            onChange={e => setCity(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#10b981] outline-none appearance-none text-white"
          >
            <option value="">All Cities</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Chicago">Chicago</option>
            <option value="Seattle">Seattle</option>
            <option value="Austin">Austin</option>
            <option value="Boston">Boston</option>
          </select>
          <select 
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="w-32 bg-white/5 border border-white/10 rounded-xl py-2 px-3 focus:border-[#10b981] outline-none appearance-none text-white"
          >
            <option value="">Rating</option>
            <option value="4.0">4.0+</option>
            <option value="4.3">4.3+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Searching network...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No specialists found.</div>
        ) : (
          doctors.map(doc => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={doc._id} 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#0ea5e9] flex items-center justify-center text-xl font-bold shadow-lg">
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{doc.name}</h4>
                  <p className="text-sm text-[#10b981] font-medium mb-1">{doc.specialization}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> New York</span>
                    <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500"/> 4.9</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setBookingDoc(doc)}
                className="opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-[#10b981] hover:text-white px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4"/> Book
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {bookingDoc && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-3xl p-6 flex flex-col z-20"
          >
            <h3 className="text-xl font-bold mb-4">Book with {bookingDoc.name}</h3>
            <form onSubmit={handleBook} className="flex flex-col flex-1">
              <label className="block text-sm text-gray-400 mb-2">Select Date & Time</label>
              <input 
                type="datetime-local" 
                required
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-6 outline-none focus:border-[#10b981]"
              />
              <div className="mt-auto flex gap-3">
                <button type="button" onClick={() => setBookingDoc(null)} className="flex-1 glass py-3 rounded-xl hover:bg-white/10">Cancel</button>
                <button type="submit" className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]">Confirm</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorFinder;
