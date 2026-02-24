import UserTable from "./UserTable";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <UserTable />
    </div>
  );
}
