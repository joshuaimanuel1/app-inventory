import RoleGuard from "@/components/auth/RoleGuard";
import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <div>
        <h1 className="text-3xl font-bold mb-8">Create New Admin</h1>

        <CreateAdminForm />
      </div>
    </RoleGuard>
  );
}
