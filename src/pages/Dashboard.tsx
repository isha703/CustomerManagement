import CustomerModal, { Customer } from "./CustomerModal";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/store/hooks";
import { selectUser, resetAuth } from "../features/auth/authSlice";
import { Plus, UserCircle2, LogOut, Edit2, Trash2 } from "lucide-react";
import { BACKEND_ORIGIN,AES_SECRET } from '../features/auth/common/constants';
import { encryptPayload } from "../utils/jwt"; 

 
const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector(selectUser);
 
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  // new: toast state + helper
  type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success', ttl = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(s => [{ id, type, message }, ...s]);
    setTimeout(() => setToasts(s => s.filter(t => t.id !== id)), ttl);
  };
 
  // helper to parse response and surface server message (error|message)
  const handleApiResponse = async (res: Response) => {
    const contentType = res.headers.get('content-type') || '';
    if (res.ok) {
      if (contentType.includes('application/json')) return res.json();
      return null;
    }
    // parse error body if possible
    let body: any = null;
    try {
      if (contentType.includes('application/json')) body = await res.json();
      else body = { message: await res.text() };
    } catch {
      body = { message: `Request failed (${res.status})` };
    }
    const errMsg = body?.error || body?.message || JSON.stringify(body);
    throw new Error(errMsg);
  };

  useEffect(() => {
    if (reduxUser?.email) {
      fetch(`${BACKEND_ORIGIN}/api/customers/data?email=${encodeURIComponent(reduxUser.email)}`, { credentials: "include" })
        .then(handleApiResponse)
        .then(data => {
          setCustomers(data || []);
        })
        .catch(err => {
          console.error(err);
          showToast((err as Error).message || 'Failed to load customers', 'error');
        });
    }

  }, [reduxUser]);
 
  const handleLogout = () => {
    dispatch(resetAuth());
    window.location.href = "/";
  };
 
  const handleDelete = async (encryptedId?: string | null | number) => {
    if (!encryptedId) {
      console.warn("handleDelete called without an encryptedId");
      showToast('Missing customer id', 'error');
      return;
    }
    const eidEncrypted = await encryptPayload(String(encryptedId), AES_SECRET);
    fetch(`${BACKEND_ORIGIN}/api/customers?eid=${encodeURIComponent(eidEncrypted)}`, { method: "DELETE", credentials: "include" })
      .then(handleApiResponse)
      .then(() => {
        // optimistic update
        setCustomers(prev => prev.filter(c => {
          const key = (c as any).encryptedId ?? (c as any).eid ?? c.id;
          return String(key) !== String(encryptedId);
        }));
        showToast('Customer deleted', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast((err as Error).message || 'Delete failed', 'error');
      });
  };
 
  const handleSubmit = async (customer: Customer) => {
  const payload = {
    ...customer,
    createdBy: reduxUser?.email,
  };

  if (editingCustomer) {
    // Encrypt the ID
    const eidEncrypted = await encryptPayload(String(editingCustomer.id), AES_SECRET);

    fetch(`${BACKEND_ORIGIN}/api/customers/update?eid=${encodeURIComponent(eidEncrypted)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(handleApiResponse)
      .then((data: any) => {
        setCustomers(prev => prev.map(c => (c.id === data.id ? data : c)));
        setEditingCustomer(null);
        showToast('Customer updated', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast((err as Error).message || 'Update failed', 'error');
      });
  } else {
    // Add new customer
    fetch(`${BACKEND_ORIGIN}/api/customers/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(handleApiResponse)
      .then((data: any) => {
        setCustomers(prev => [...prev, data]);
        showToast('Customer added', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast((err as Error).message || 'Create failed', 'error');
      });
  }

  setModalOpen(false);
};


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Centered alert toasts (non-blocking) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2 w-full max-w-md px-4">
          {toasts.map(t => (
            <div
              key={t.id}
              // allow clicks on toast but keep overlay non-interactive
              className={`pointer-events-auto w-full max-w-md px-4 py-2 rounded shadow-md text-sm ${t.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : t.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-blue-900 shadow flex items-center justify-between px-6 py-3">
        <h1 className="text-lg font-semibold text-white tracking-wide">Customer Dashboard</h1>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => { setEditingCustomer(null); setModalOpen(true); }}
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </button>

          {/* Profile */}
          <div className="relative">
            <UserCircle2
              className="w-8 h-8 text-white cursor-pointer hover:text-blue-200 transition"
              onClick={() => setShowUserInfo(!showUserInfo)}
            />
            {showUserInfo && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{reduxUser?.name || "Unknown User"}</h3>
                <p className="text-gray-600 text-sm mb-2">{reduxUser?.email || ""}</p>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 text-sm font-semibold hover:text-red-800 transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Customer Table */}
  <div className="p-6">
  {customers.length === 0 ? (
    <p className="text-gray-600 text-center mt-10">No customers added yet.</p>
  ) : (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-yellow-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">S. No.</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Phone</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr
              key={ idx}
              className={`${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 transition`}
            >
              <td className="py-3 px-4 text-sm text-gray-800">{idx + 1}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{c.firstName} {c.lastName}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{c.email}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{c.phone}</td>
              <td className="py-3 px-4 text-sm text-gray-800 flex gap-2">
                <button
                  onClick={() => { setEditingCustomer(c); setModalOpen(true); }}
                  className="w-8 h-8 bg-gray-200 shadow-md hover:shadow-lg hover:bg-gray-300 transition flex items-center justify-center rounded"
                  aria-label="Edit customer"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete((c as any)?.encryptedId ?? (c as any)?.eid ?? c.id)}
                  className="w-8 h-8 bg-gray-200 shadow-md hover:shadow-lg hover:bg-gray-300 transition flex items-center justify-center rounded"
                  aria-label="Delete customer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


      {/* Reusable Modal for Add/Edit */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialValues={editingCustomer ?? { id: undefined, firstName: "", lastName: "", email: "", phone: "" }}
        onSubmit={handleSubmit}
        title={editingCustomer ? "Update Customer" : "Add Customer"}
      />
    </div>
  );
};
 
export default Dashboard;
