"use client"; // Ensures client-side rendering in Next.js 13+

import { useRef } from "react";
import { useLocation } from "react-router";

export default function PrintJSONTable() {
  const printRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data } = location.state || {}
  const handlePrint = () => {
    if (!printRef.current || typeof window === "undefined") return;

    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "", "width=800,height=600");
    if (!newWindow) return;

    newWindow.document.write("<html><head><title>Print</title>");
    newWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
      </style>
    `);
    newWindow.document.write("</head><body>");
    newWindow.document.write(printContents);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div>
      <div ref={printRef}>
        <h2 style={{ textAlign: "center" }}>User Report</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Dress Code</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>{data.name}</td>
                <td>{data.phone}</td>
                <td>{data.code}</td>
              </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={handlePrint}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Print Table
      </button>
    </div>
  );
}
