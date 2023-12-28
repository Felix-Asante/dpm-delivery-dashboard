"use client";
import { GetUsersResponse } from "@/actions/users";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import { UserRoles } from "@/config/constants";
import useQueryParams from "@/hooks/useQueryParam";
import { pluralize } from "@/utils/helpers";
import {
	Button,
	Pagination,
	Tab,
	Tabs,
	useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import UsersTable from "./UsersTable";
import Modal from "@/components/shared/modal";
import CreateNewUserContent from "./CreateNewUserContent";

interface Props {
	usersResult: GetUsersResponse;
}
export default function UsersListSection({ usersResult }: Props) {
	const { add, query } = useQueryParams();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const totalPages = usersResult?.meta?.totalPages;
	const totalUsers = usersResult?.meta?.totalItems;
	const users = usersResult?.items;
	return (
		<div>
			<nav className='border-b border-gray-100 p-2 pb-0'>
				<Tabs
					variant='underlined'
					aria-label='Tabs variants'
					color='primary'
					onSelectionChange={(key) =>
						add("role", key === "all" ? "" : key?.toString())
					}
					selectedKey={query?.role || "User"}
				>
					{["User", "Place Admin", "Rider"].map((role) => (
						<Tab key={role} title={role} className='capitalize pb-0' />
					))}
				</Tabs>
			</nav>
			<div className='px-4 mt-4'>
				<HStack className='justify-between items-center my-3 mb-6'>
					<div>
						<h3 className='font-semibold text-xl'>
							{totalUsers} {pluralize("User", totalUsers)}
						</h3>
						<p className='text-gray-400'>List of all users</p>
					</div>
					<Button
						radius='sm'
						size='md'
						color='primary'
						disableRipple
						className='font-semibold'
						onClick={onOpen}
					>
						Add new user
					</Button>
				</HStack>
				<UsersTable users={users} />
				{totalPages > 1 && (
					<HStack className='justify-center mt-2'>
						<Pagination
							total={totalPages}
							initialPage={1}
							variant='bordered'
							showControls
							onChange={(page) => add("page", page.toString())}
						/>
					</HStack>
				)}
			</div>
			<Modal
				title='Create new user'
				isOpen={isOpen}
				onClose={onClose}
				content={<CreateNewUserContent />}
			/>
		</div>
	);
}
