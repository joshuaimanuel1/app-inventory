import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Admin</h1>
        <p className="text-gray-400 text-sm">
          Register a new administrator account securely to delegate system
          management and control.
        </p>
      </div>

      <CreateAdminForm />
    </div>
  );
}
