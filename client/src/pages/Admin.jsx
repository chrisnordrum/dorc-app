import { useEffect, useMemo, useState } from "react";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function Admin() {
  const authFetch = useAuthFetch();

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await authFetch("/api/admin");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Access denied");
        }

        setMessage(data.message);

        const usersRes = await authFetch("/api/admin/users");
        const usersData = await usersRes.json();

        if (!usersRes.ok) {
          throw new Error(usersData.message || "Failed to load users");
        }

        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchAdmin();
  }, [authFetch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
      const username = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        username.includes(search) ||
        email.includes(search);

      const matchesRole =
        roleFilter === "" || role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-accent/20 flex items-center justify-center">
        <h2 className="text-red-700 text-xl">{error}</h2>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-bg to-accent/20">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 opacity-30 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400 dark:bg-purple-600 opacity-30 rounded-full blur-3xl" />

      <div className="relative z-10 p-6">
        <div className="mb-6">
          <h1 className="text-left text-fg">Admin Dashboard</h1>
          <p className="font-light text-fg/80">{message}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[8fr,2fr] mb-6">
          <div className="relative">
            <label
              htmlFor="userSearch"
              className="block text-sm font-medium text-fg mb-2"
            >
              Search Users
            </label>
            <input
              type="text"
              id="userSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent w-full p-2 border border-border rounded-full text-fg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search by name, username, or email..."
            />
            <RiSearchLine
              size={25}
              className="absolute left-3 top-9 text-border"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="roleFilter"
              className="block text-sm font-medium text-fg mb-2"
            >
              Filter by Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-5 appearance-none w-full p-2 border border-border rounded-full bg-transparent text-fg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <RiArrowDownSLine
              size={25}
              className="absolute right-3 top-9 text-border"
            />
          </div>
        </div>

        <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {filteredUsers.length === 0 ? (
            <p className="text-fg/80">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-card p-5 rounded-2xl border border-border shadow-lg hover:shadow-xl transition relative min-h-[150px]"
              >
                <h3 className="text-lg font-semibold text-fg">
                  {user.first_name} {user.last_name}
                </h3>

                <p className="text-fg text-sm mt-1">@{user.username}</p>
                <p className="text-fg text-sm mt-2 break-all">{user.email}</p>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400 dark:bg-blue-300/50 dark:text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
