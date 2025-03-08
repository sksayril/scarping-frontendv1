import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";

export default function HistorySection() {
  const [history, setHistory] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchScrapedData = async () => {
      try {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
          console.error("User token not found in localStorage.");
          return;
        }

        const response = await axios.post("https://7cvccltb-5000.inc1.devtunnels.ms/api/data/get-scraped-data", {
          userToken,
        });

        setHistory(response.data.data);

        // Set default selected keyword (first available)
        if (response.data.data.length > 0) {
          setSelectedKeyword(response.data.data[0].keyword);
          setFilteredData(response.data.data[0].data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchScrapedData();
  }, []);

  // Handle keyword selection
  const handleKeywordChange = (event) => {
    const keyword = event.target.value;
    setSelectedKeyword(keyword);
    const selectedItem = history.find((item) => item.keyword === keyword);
    setFilteredData(selectedItem ? selectedItem.data : []);
    setCurrentPage(1); // Reset to first page on selection change
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ScrapedData");
    XLSX.writeFile(workbook, `${selectedKeyword}.xlsx`);
  };

  // Export to PDF with proper formatting
  const exportToPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.text("Leads Data", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Phone", "Stars", "Reviews", "Website"]],
      body: filteredData.map((lead) => [
        lead.title || "N/A",
        lead.phone || "N/A",
        lead.stars !== undefined ? lead.stars.toString() : "N/A",
        lead.reviews !== undefined ? lead.reviews.toString() : "N/A",
        lead.website || "N/A",
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 30 }, 4: { cellWidth: 50 } },
    });

    doc.save(`${selectedKeyword}.pdf`);
};


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Scraped Data History</h2>

      {/* Dropdown to Select Keyword */}
      {history.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Keyword:</label>
          <select
            value={selectedKeyword}
            onChange={handleKeywordChange}
            className="w-full p-2 border rounded"
          >
            {history.map((item) => (
              <option key={item._id} value={item.keyword}>
                {item.keyword}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Download Buttons */}
      <div className="flex justify-between mb-4">
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded">
          <Download size={16} className="inline mr-2" />
          Download Excel
        </button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          <Download size={16} className="inline mr-2" />
          Download PDF
        </button>
      </div>

      {/* Cards View */}
      {currentItems.length > 0 ? (
        currentItems.map((lead, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg mb-4 shadow">
            <h3 className="text-lg font-semibold">{lead.title}</h3>
            <a href={lead.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View on Maps
            </a>
            <p>⭐ {lead.stars} ({lead.reviews} reviews)</p>
            {lead.phone && <p>📞 {lead.phone}</p>}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-green-500">
                Visit Website
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No data available for the selected keyword.</p>
      )}

      {/* Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold">
            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button onClick={nextPage} disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
