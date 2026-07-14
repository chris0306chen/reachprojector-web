"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, CheckCircle } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  inquiry_type: string;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchInquiries(); }, [page, statusFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/inquiries?${params}`);
      const data = await res.json();
      setInquiries(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) { console.error("Failed to fetch inquiries:", err); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });
      setInquiries(inquiries.map((i) => i.id === id ? { ...i, status: "read" } : i));
    } catch (err) { console.error("Failed to update inquiry:", err); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Inquiries</h1>

      <div className="flex gap-2 mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedInquiry(inquiry)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${inquiry.status === "pending" ? "bg-orange-500" : "bg-slate-300"}`} />
                    <div>
                      <p className="font-medium text-slate-900">{inquiry.name}</p>
                      <p className="text-sm text-slate-500">{inquiry.email}</p>
                      {inquiry.company && <p className="text-xs text-slate-400">{inquiry.company}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${inquiry.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`}>
                      {inquiry.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{inquiry.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{inquiry.inquiry_type}</span>
                  {inquiry.subject && <span className="text-xs text-slate-500">{inquiry.subject}</span>}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <div className="p-8 text-center text-slate-500">No inquiries found</div>}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedInquiry.name}</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-600">x</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-4 h-4" />{selectedInquiry.email}</div>
              {selectedInquiry.phone && <p className="text-sm text-slate-600">Phone: {selectedInquiry.phone}</p>}
              {selectedInquiry.company && <p className="text-sm text-slate-600">Company: {selectedInquiry.company}</p>}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { markAsRead(selectedInquiry.id); setSelectedInquiry(null); }} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mark as Read
              </button>
              <a href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || "Your Inquiry"}`} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 text-center">
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
