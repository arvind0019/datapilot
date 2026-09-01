import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Lock
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserRole, UserAccount, PermissionMatrixItem } from '../../../types';

export const AccessControlView: React.FC = () => {
  const { 
    users, 
    permissionMatrix, 
    togglePermission, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'users'>('matrix');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Developer');

  const roles: UserRole[] = ['Owner', 'Admin', 'Developer', 'Analyst', 'Viewer'];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviteModalOpen(false);
    setInviteEmail('');
    addToast({
      type: 'success',
      title: 'Invitation Sent',
      message: `Invited ${inviteEmail} as ${inviteRole}.`
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Role-Based Access Control (RBAC)
            </h1>
            <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              ENTERPRISE SECURITY
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Granular resource permissions, role assignment matrices, and team governance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-[#080c16] p-1 border-2 border-[#2a364f] shadow-[3px_3px_0px_#000] font-mono">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'matrix' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Permission Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'users' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Users & Members ({users.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            <span>INVITE MEMBER</span>
          </button>
        </div>
      </div>

      {/* Tab: Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="brutal-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
            <div>
              <h3 className="font-display text-sm font-black text-white uppercase">Granular Resource Permission Matrix</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Click checkboxes to toggle privileges per role tier in real-time.</p>
            </div>
            <span className="rounded bg-emerald-400 text-black px-1.5 py-0.2 font-mono text-[9px] font-black border border-black">
              SYNCED ACROSS MESH
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-[#2a364f] bg-[#080c16] shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b-2 border-[#1c253b] bg-[#0c101c] text-[10px] uppercase text-slate-400 font-black">
                <tr>
                  <th className="px-4 py-3">RESOURCE PRIVILEGE</th>
                  {roles.map((role) => (
                    <th key={role} className="px-4 py-3 text-center">
                      <span className={`rounded px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000] ${
                        role === 'Owner' ? 'bg-[#ffee00] text-black' :
                        role === 'Admin' ? 'bg-cyan-400 text-black' :
                        role === 'Developer' ? 'bg-emerald-400 text-black' :
                        'bg-slate-700 text-slate-200'
                      }`}>
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c253b] text-slate-200">
                {permissionMatrix.map((item: PermissionMatrixItem, itemIdx: number) => {
                  const itemId = item.id || `perm-${itemIdx}`;
                  const allowedList = item.allowedRoles || (item.actions[0] ? roles.filter(r => item.actions[0][r]) : roles);

                  return (
                    <tr key={itemId} className="hover:bg-[#12192a]">
                      <td className="px-4 py-3 font-bold text-white">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-3 w-3 text-slate-500" />
                          <span>{item.resource}</span>
                        </div>
                      </td>
                      {roles.map((role: UserRole) => {
                        const isAllowed = allowedList.includes(role);
                        const isOwner = role === 'Owner';

                        return (
                          <td key={role} className="px-4 py-3 text-center">
                            <button
                              onClick={() => !isOwner && togglePermission(itemId, role)}
                              disabled={isOwner}
                              className={`h-6 w-6 mx-auto rounded flex items-center justify-center border-2 transition-all ${
                                isAllowed
                                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[2px_2px_0px_#000]'
                                  : 'border-slate-700 bg-slate-900/40 text-slate-600'
                              } ${!isOwner ? 'cursor-pointer hover:border-white' : 'cursor-not-allowed opacity-90'}`}
                            >
                              {isAllowed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users & Members */}
      {activeTab === 'users' && (
        <div className="brutal-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
            <h3 className="font-display text-sm font-black text-white uppercase">WORKSPACE TEAM DIRECTORY</h3>
            <span className="text-xs font-mono text-slate-400">Total Members: {users.length}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-[#2a364f] bg-[#080c16] shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b-2 border-[#1c253b] bg-[#0c101c] text-[10px] uppercase text-slate-400 font-black">
                <tr>
                  <th className="px-4 py-3">MEMBER</th>
                  <th className="px-4 py-3">ROLE</th>
                  <th className="px-4 py-3">2FA STATUS</th>
                  <th className="px-4 py-3">LAST ACTIVE</th>
                  <th className="px-4 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c253b] text-slate-200">
                {users.map((user: UserAccount) => (
                  <tr key={user.id} className="hover:bg-[#12192a]">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatarUrl || user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                          alt={user.name} 
                          className="h-7 w-7 rounded-md object-cover border border-black shadow-[1.5px_1.5px_0px_#000]" 
                        />
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#152037] text-cyan-300 px-2 py-0.5 font-bold border border-[#2a364f]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-bold">✓ ENABLED</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-400 text-black px-1.5 py-0.2 text-[9px] font-black border border-black">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 font-mono text-xs">
          <div className="w-full max-w-md rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase">INVITE WORKSPACE MEMBER</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="analyst@company.com"
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">ASSIGNED RBAC ROLE</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="brutal-btn bg-[#131b2e] px-3 py-1.5 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-primary px-4 py-1.5 font-black"
                >
                  SEND INVITE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
