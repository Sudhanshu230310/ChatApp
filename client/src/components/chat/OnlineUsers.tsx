import { Users, UserPlus } from "lucide-react";

interface OnlineUsersProps {
  username: string;
  onlineUsers: string[];
}

export default function OnlineUsers({ username, onlineUsers }: OnlineUsersProps) {
  const totalUsers = onlineUsers.length + 1; // +1 for current user

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden lg:block">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">
          <Users className="inline mr-2 text-slate-500" size={14} />
          Online Users
        </h2>
        <div className="text-xs text-slate-500 mb-3">
          {totalUsers} user{totalUsers !== 1 ? "s" : ""} online
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Current User */}
        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {username} (You)
            </p>
            <p className="text-xs text-slate-500">Just now</p>
          </div>
        </div>

        {/* Other Online Users */}
        {onlineUsers.map((user) => (
          <div key={user} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition duration-150">
            <div className="relative">
              <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  {user.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{user}</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
