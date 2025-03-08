// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Download, CheckCircle, MapPin, ArrowUp, AlertCircle } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// interface Lead {
//   title: string;
//   link: string;
//   stars: number;
//   reviews: number;
//   phone: string | null;
//   website?: string;
// }

// interface ScrapeResponse {
//   message: string;
//   data: Lead[];
//   extractedCount: number;
//   remainingCredits: number;
//   error?: string;
// }

// interface LeadGeneratorProps {
//   user?: any;
//   onSwitchSection?: (section: string, props?: any) => void;
// }

// const LeadGenerator: React.FC<LeadGeneratorProps> = ({ user, onSwitchSection }) => {
//   const [keyword, setKeyword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [allLeads, setAllLeads] = useState<Lead[]>([]);
//   const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
//   const [credits, setCredits] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [userToken, setUserToken] = useState<string>('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
//   const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
//   const itemsPerPage = 12;

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setUserToken(token);
//       fetchCredits(token);
//     } else {
//       setError('User token not found. Please log in again.');
//     }
//   }, []);
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null); // Hide notification after 1 second
//       }, 1000);
//       return () => clearTimeout(timer); // Cleanup timeout on re-render
//     }
//   }, [notification]);

//   useEffect(() => {
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     setDisplayedLeads(allLeads.slice(startIndex, endIndex));
//     setTotalPages(Math.max(1, Math.ceil(allLeads.length / itemsPerPage)));
//   }, [page, allLeads]);

//   const fetchCredits = async (token: string) => {
//     if (!token) return;
    
//     try {
//       const response = await axios.post('https://7cvccltb-5000.inc1.devtunnels.ms/api/users/get-credits', {
//         userToken: token
//       });
//       setCredits(response.data.credits);
//     } catch (err) {
//       setError('Failed to fetch credits');
//       handleTokenError(err);
//     }
//   };

//   const handleTokenError = (err: any) => {
//     if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//       setError('Your session has expired. Please log in again.');
//     }
//   };

//   const handleSearch = async () => {
//     if (!userToken) {
//       setError('User token not found. Please log in again.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post<ScrapeResponse>(
//         'https://7cvccltb-5000.inc1.devtunnels.ms/api/data/scrape',
//         {
//           userToken,
//           keyword
//         }
//       );
      
//       if (response.data.error === "Not enough credits. Minimum 50 credit required.") {
//         setIsUpgradeModalOpen(true);
//       } else {
//         const newLeads = response.data.data;
//         setAllLeads(prevLeads => [...prevLeads, ...newLeads]);
//         setCredits(response.data.remainingCredits);
//         setPage(1);
        
//         setNotification({
//           message: `Successfully fetched ${newLeads.length} leads!`,
//           type: 'success'
//         });
//       }
//     } catch (err: any) {
//       if (err.response?.data?.error === "Not enough credits. Minimum 50 credit required.") {
//         setIsUpgradeModalOpen(true);
//       } else {
//         setError('Failed to fetch leads');
//         handleTokenError(err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpgradeClick = () => {
//     setIsUpgradeModalOpen(false);
//     if (onSwitchSection) {
//       onSwitchSection('user');
//     }
//   };

//   const downloadExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(allLeads);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Leads');
//     XLSX.writeFile(wb, 'leads.xlsx');
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.autoTable({
//       head: [['Title', 'Phone', 'Stars', 'Reviews', 'Website']],
//       body: allLeads.map(lead => [
//         lead.title,
//         lead.phone || 'N/A',
//         lead.stars,
//         lead.reviews,
//         lead.website || 'N/A'
//       ]),
//     });
//     doc.save('leads.pdf');
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-4">
//         <input
//           type="text"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           placeholder="Search Keyword"
//           className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//         />
//         <button
//           onClick={handleSearch}
//           disabled={loading || !userToken}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
//         >
//           {loading ? (
//             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//           ) : (
//             'Search'
//           )}
//         </button>
//       </div>

//       {credits !== null && (
//         <p className="text-gray-700">
//           Remaining Credits: {credits}
//         </p>
//       )}

//       {error && (
//         <div className="flex items-center gap-2 text-red-600">
//           <AlertCircle className="w-5 h-5" />
//           <p>{error}</p>
//         </div>
//       )}

//       {allLeads.length > 0 && (
//         <div className="flex justify-between items-center">
//           <div className="flex gap-2">
//             <button
//               onClick={downloadExcel}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <Download className="w-4 h-4" />
//               Download Excel
//             </button>
//             <button
//               onClick={downloadPDF}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <Download className="w-4 h-4" />
//               Download PDF
//             </button>
//           </div>
//           <p className="text-gray-700">
//             Total Leads: {allLeads.length}
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {displayedLeads.map((lead, index) => (
//           <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">{lead.title}</h3>
//             <div className="flex items-center gap-2 text-gray-600">
//               <span>⭐ {lead.stars}</span>
//               <span>({lead.reviews} reviews)</span>
//             </div>
//             <div className="flex items-center gap-2">
//               {lead.phone ? (
//                 <>
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   <span>{lead.phone}</span>
//                 </>
//               ) : (
//                 <span className="px-2 py-1 text-sm bg-gray-100 rounded-full">No Phone</span>
//               )}
//             </div>
//             {lead.website && (
//               <a
//                 href={lead.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline"
//               >
//                 Visit Website
//               </a>
//             )}
//             <button
//               onClick={() => window.open(lead.link, '_blank')}
//               className="text-blue-500 hover:text-blue-600"
//             >
//               <MapPin className="w-5 h-5" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {allLeads.length > 0 && (
//         <div className="flex justify-center mt-8">
//           <div className="flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//               <button
//                 key={pageNum}
//                 onClick={() => handlePageChange(pageNum)}
//                 className={`px-4 py-2 rounded-lg ${
//                   page === pageNum
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {pageNum}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Upgrade Modal */}
//       {isUpgradeModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <h2 className="text-xl font-semibold mb-4">Upgrade Your Account</h2>
//             <p className="mb-6">
//               You don't have enough credits to perform this search. Minimum 50 credits required.
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setIsUpgradeModalOpen(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpgradeClick}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Upgrade Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notification */}
//       {notification && (
//   <div
//     className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-500 ${
//       notification.type === 'success' ? 'bg-green-500' :
//       notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
//     } text-white`}
//   >
//     {notification.message}
//   </div>
// )}

//       {/* Scroll to top button */}
//       {allLeads.length > itemsPerPage && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50"
//         >
//           <ArrowUp className="w-5 h-5 text-gray-600" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default LeadGenerator;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, CheckCircle, MapPin, Search, ChevronLeft, ChevronRight, AlertCircle, X, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Lead {
  title: string;
  link: string;
  stars: number;
  reviews: number;
  phone: string | null;
  website?: string;
  id?: string; // Added to help with deduplication
}

interface ScrapeResponse {
  message: string;
  data: Lead[];
  extractedCount: number;
  remainingCredits: number;
  error?: string;
}

const itemsPerPage = 10;

const LeadGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Use a ref to keep track of seen leads to prevent duplicates
  const seenLeadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
      fetchCredits(token);
    } else {
      setError('User token not found. Please log in again.');
    }

    // Try to load saved leads from localStorage
    const savedLeads = localStorage.getItem('savedLeads');
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads) as Lead[];
        setAllLeads(parsedLeads);
        
        // Update the seenLeads set
        parsedLeads.forEach(lead => {
          // Create a unique identifier for each lead
          const leadId = `${lead.title}-${lead.link}`;
          seenLeadsRef.current.add(leadId);
        });
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }

    const savedSearches = localStorage.getItem('searchHistory');
    if (savedSearches) {
      try {
        setSearchHistory(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  // Save leads to localStorage whenever they change
  useEffect(() => {
    if (allLeads.length > 0) {
      localStorage.setItem('savedLeads', JSON.stringify(allLeads));
    }
  }, [allLeads]);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const fetchCredits = async (token: string) => {
    if (!token) return;
    try {
      const response = await axios.post('https://7cvccltb-5000.inc1.devtunnels.ms/api/users/get-credits', { userToken: token });
      setCredits(response.data.credits);
    } catch (err) {
      setError('Failed to fetch credits');
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword to search');
      return;
    }
    
    if (!userToken) {
      setError('User token not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<ScrapeResponse>('https://7cvccltb-5000.inc1.devtunnels.ms/api/data/scrape', { userToken, keyword });

      if (response.data.error && response.data.error.includes("Not enough credits")) {
        setIsUpgradeModalOpen(true);
      } else {
        // Add unique identifier to each lead
        const newLeads = response.data.data || [];
        
        // Filter out duplicates and add to existing leads
        const uniqueNewLeads = newLeads.filter(lead => {
          const leadId = `${lead.title}-${lead.link}`;
          if (seenLeadsRef.current.has(leadId)) {
            return false;
          } else {
            seenLeadsRef.current.add(leadId);
            return true;
          }
        });

        setAllLeads(prevLeads => [...prevLeads, ...uniqueNewLeads]);
        setCredits(response.data.remainingCredits);
        
        // Add to search history if it's a new keyword
        if (!searchHistory.includes(keyword)) {
          setSearchHistory(prev => [keyword, ...prev.slice(0, 9)]);
        }
        
        // Show success notification
        if (uniqueNewLeads.length > 0) {
          setNotification({
            message: `Added ${uniqueNewLeads.length} new leads`,
            type: 'success'
          });
        } else {
          setNotification({
            message: 'No new leads found',
            type: 'error'
          });
        }
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setIsUpgradeModalOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(allLeads.length / itemsPerPage)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearAllLeads = () => {
    if (window.confirm('Are you sure you want to clear all leads? This cannot be undone.')) {
      setAllLeads([]);
      seenLeadsRef.current.clear();
      localStorage.removeItem('savedLeads');
    }
  };

  const handleKeywordSelect = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
  };

  // Convert to PDF
  const downloadPDF = () => {
    if (allLeads.length === 0) {
      setError('No leads to download');
      return;
    }
    
    const doc = new jsPDF();
    doc.text("Leads Data", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Title', 'Phone', 'Stars', 'Reviews', 'Website']],
      body: allLeads.map(lead => [
        lead.title,
        lead.phone || 'N/A',
        lead.stars.toString(),
        lead.reviews.toString(),
        lead.website ? lead.website : 'N/A'
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 30 }, 4: { cellWidth: 50 } }
    });

    doc.save('leads.pdf');
  };

  // Convert to Excel
  const downloadExcel = () => {
    if (allLeads.length === 0) {
      setError('No leads to download');
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(allLeads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, 'leads.xlsx');
  };

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </span>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`${notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-yellow-100 border-yellow-400 text-yellow-700'} px-4 py-3 rounded relative mb-4 border`}>
          <span className="block sm:inline">{notification.message}</span>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setNotification(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
            className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !userToken}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => handleKeywordSelect(term)}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Credits and Lead Count Display */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {credits !== null && (
          <div className="bg-blue-50 p-3 rounded-lg text-center flex-1">
            <p className="text-blue-700 text-lg">
              Remaining Credits: <strong>{credits}</strong>
            </p>
          </div>
        )}
        <div className="bg-gray-50 p-3 rounded-lg text-center flex-1">
          <p className="text-gray-700 text-lg">
            Total Leads: <strong>{allLeads.length}</strong>
          </p>
        </div>
      </div>

      {/* Leads List */}
      {allLeads.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Your Leads</h2>
            <button
              onClick={clearAllLeads}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((lead, index) => (
              <div key={`${lead.title}-${lead.link}-${index}`} className="bg-white rounded-lg shadow-md p-6 space-y-3 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{lead.title}</h3>
                <div className="flex items-center text-amber-500">
                  <span>⭐ {lead.stars}</span>
                  <span className="text-gray-600 ml-2">({lead.reviews} reviews)</span>
                </div>
                {lead.phone ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                  </div>
                ) : (
                  <div className="text-gray-400">No phone available</div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <a 
                    href={lead.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>View</span>
                  </a>
                  {lead.website && (
                    <a 
                      href={lead.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {allLeads.length > itemsPerPage && (
            <div className="flex justify-center mt-8 gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                disabled={page === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center px-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-medium">{page} / {Math.ceil(allLeads.length / itemsPerPage)}</span>
              </div>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                disabled={page === Math.ceil(allLeads.length / itemsPerPage)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button 
              onClick={downloadExcel} 
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Excel
            </button>
            <button 
              onClick={downloadPDF} 
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center py-12 text-gray-500">
            <p>No leads found. Try searching with different keywords.</p>
          </div>
        )
      )}

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upgrade Your Plan</h2>
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You don't have enough credits to perform this search. Minimum 50 credits required.
              </p>
              <p className="font-medium text-gray-700">
                Upgrade your plan to get more credits and unlock additional features.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Later
              </button>
              <a 
                href="/upgrade"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenerator;