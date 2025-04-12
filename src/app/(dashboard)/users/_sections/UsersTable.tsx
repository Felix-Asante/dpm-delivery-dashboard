import { deleteUser } from "@/actions/users";
import EmptyContent from "@/components/shared/EmptyContent";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import Modal from "@/components/shared/modal";
import { UserRoles } from "@/config/constants";
import { ERRORS } from "@/config/constants/errors";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParam";
import { useServerAction } from "@/hooks/useServerAction";
import { User } from "@/types/auth";
import { getErrorMessage } from "@/utils/helpers";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const columns = [
  { label: "Joined at", key: "JoinedAt" },
  { label: "Full Name", key: "name" },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Status", key: "status" },
  { label: "Place", key: "place" },
  { label: "", key: "" },
];

interface UsersTableProps {
  users: User[];
}
export default function UsersTable({ users }: UsersTableProps) {
  const { control, watch } = useForm();
  const [selectionBehavior, setSelectionBehavior] = useState<
    "toggle" | "replace" | undefined
  >("toggle");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set([]));
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { add, query } = useQueryParams();
  const search = useDebounce(watch("search"), 2000);

  const [runDeleteUser, { loading }] = useServerAction<any, typeof deleteUser>(
    deleteUser
  );

  useEffect(() => {
    add("search", search);
  }, [search]);

  const adminRoleSelected = query?.role === UserRoles.PLACE_ADMIN;

  const removeUser = async (id: string) => {
    try {
      if (!id || adminRoleSelected) {
        toast.error("Operation not allowed");
        return;
      }
      await runDeleteUser(id);
      toast.success("User successfully deleted");
      setSelectedUser(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const bulkDelete = async () => {
    try {
      let userIds: string[] = [];
      if (typeof selectedUsers === "string") {
        userIds = users?.map((user) => user?.id);
      } else {
        userIds = [...selectedUsers];
      }
      await Promise.all(userIds?.map((user) => removeUser(user)));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="border rounded-md p-3">
      <HStack className="items-center justify-between">
        <TextField
          name="search"
          placeholder="Search by user name"
          control={control}
          variant="bordered"
          radius="sm"
          size="md"
          className="md:w-[350px]"
          defaultValue={query?.search ?? ""}
        />
        <Button
          radius="sm"
          size="md"
          color="danger"
          disableRipple
          className="font-semibold"
          onClick={bulkDelete}
          isDisabled={selectedUsers?.size === 0 || adminRoleSelected || loading}
        >
          Delete users
        </Button>
      </HStack>
      <Table
        className="mt-4"
        aria-label="list of users"
        selectionMode="multiple"
        selectionBehavior={selectionBehavior}
        shadow="none"
        radius="none"
        selectedKeys={selectedUsers}
        // @ts-ignore
        onSelectionChange={setSelectedUsers}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<EmptyContent title="" description="Users not found" />}
        >
          {users?.map((user) => (
            <TableRow key={user?.id}>
              <TableCell>
                {new Date(user?.createdAt)?.toLocaleDateString()}
              </TableCell>
              <TableCell>{user?.fullName}</TableCell>
              <TableCell>{user?.phone}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>
                <Chip variant="dot" color="primary">
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </Chip>
              </TableCell>
              <TableCell>{user?.adminFor?.name}</TableCell>
              <TableCell>
                <HStack className="items-center justify-end">
                  <Button
                    radius="sm"
                    size="sm"
                    disableRipple
                    color="danger"
                    onClick={() => setSelectedUser(user?.id)}
                    isIconOnly
                    isDisabled={adminRoleSelected}
                  >
                    <Trash2Icon className="text-white" size={15} />
                  </Button>
                </HStack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Delete user"
        description={ERRORS.MESSAGE.DELETE_PROMPT}
        content={
          <HStack className="justify-end">
            <Button
              variant="bordered"
              radius="sm"
              size="sm"
              onClick={() => setSelectedUser(null)}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onClick={() => removeUser(selectedUser!)}
              isLoading={loading}
            >
              Continue
            </Button>
          </HStack>
        }
      />
    </div>
  );
}
