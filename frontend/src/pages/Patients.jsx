import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import AdmitPatientModal from '../components/AdmitPatientModal';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients?search=${search}&page=${page}&limit=10`);
      setPatients(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        toast.success('Patient deleted');
        fetchPatients();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Patient Directory</h1>
          <p className="text-gray-400">Manage admissions, discharges, and records.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0ea5e9] hover:bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Admit Patient
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patients by name..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium text-gray-400">Name</th>
                <th className="p-4 font-medium text-gray-400">Severity</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400">Bed</th>
                <th className="p-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No patients found.</td></tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{patient.name}</p>
                      <p className="text-sm text-gray-400">{patient.age}y, {patient.gender}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        patient.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                        patient.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                        patient.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {patient.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        patient.status === 'Waiting' ? 'bg-orange-500/20 text-orange-500' :
                        patient.status === 'Admitted' ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {patient.assignedBed ? patient.assignedBed.bedNumber : 'N/A'}
                    </td>
                    <td className="p-4 flex gap-3">
                      <button className="text-gray-400 hover:text-[#0ea5e9] transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(patient._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
          <span>Showing page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded glass hover:bg-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded glass hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AdmitPatientModal onClose={() => setIsModalOpen(false)} onRefresh={fetchPatients} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;
