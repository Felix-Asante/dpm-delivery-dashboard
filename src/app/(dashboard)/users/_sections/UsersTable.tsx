import EmptyContent from "@/components/shared/EmptyContent";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { UserRoles } from "@/config/constants";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParam";
import { User } from "@/types/auth";
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

const columns = [
	{ label: "Joined at", key: "JoinedAt" },
	{ label: "Full Name", key: "name" },
	{ label: "Phone", key: "phone" },
	{ label: "Email", key: "email" },
	{ label: "Status", key: "status" },
	{ label: "Place", key: "place" },
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
	const { add, query } = useQueryParams();
	const search = useDebounce(watch("search"), 2000);

	useEffect(() => {
		add("search", search);
	}, [search]);

	const adminRoleSelected = query?.role === UserRoles.PLACE_ADMIN;

	return (
		<div className='border rounded-md p-3'>
			<HStack className='items-center justify-between'>
				<TextField
					name='search'
					placeholder='Search by user name'
					control={control}
					variant='bordered'
					radius='sm'
					size='sm'
					className='md:w-[350px]'
					defaultValue={query?.search ?? ""}
				/>
				<Button
					radius='sm'
					size='md'
					color='danger'
					disableRipple
					className='font-semibold'
					// onClick={onOpen}
					isDisabled={selectedUsers?.size === 0 || adminRoleSelected}
				>
					Delete users
				</Button>
			</HStack>
			<Table
				className='mt-4'
				aria-label='list of users'
				selectionMode='multiple'
				selectionBehavior={selectionBehavior}
				shadow='none'
				radius='none'
				selectedKeys={selectedUsers}
				onSelectionChange={setSelectedUsers}
			>
				<TableHeader>
					{columns.map((column) => (
						<TableColumn key={column.key}>{column.label}</TableColumn>
					))}

					<TableColumn>{null}</TableColumn>
				</TableHeader>
				<TableBody
					emptyContent={<EmptyContent title='' description='Users not found' />}
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
								<Chip variant='dot' color='primary'>
									{user?.isVerified ? "Verified" : "Not Verified"}
								</Chip>
							</TableCell>
							<TableCell>{user?.adminFor?.name}</TableCell>
							<TableCell>
								<HStack className='items-center justify-end'>
									<Button
										radius='sm'
										size='sm'
										disableRipple
										color='danger'
										// onClick={() => setSelectedCategory(category)}
										isIconOnly
										isDisabled={adminRoleSelected}
									>
										<Trash2Icon className='text-white' size={15} />
									</Button>
								</HStack>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
