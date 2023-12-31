import { deleteOffer } from "@/actions/specials";
import EmptyContent from "@/components/shared/EmptyContent";
import TextField from "@/components/shared/input/TextField";
import HStack from "@/components/shared/layout/HStack";
import Modal from "@/components/shared/modal";
import { ERRORS } from "@/config/constants/errors";
import { DASHBOARD_PATHS } from "@/config/routes";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParam";
import { useServerAction } from "@/hooks/useServerAction";
import { Special } from "@/types/specials";
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
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
	offers: Special[];
}

const columns = [
	{ key: "createdAt", label: "Created At" },
	{ key: "title", label: "Title" },
	{ key: "establishment", label: "Establishment" },
	{ key: "discount", label: "Discount" },
	{ key: "price", label: "Price" },
	{ key: "type", label: "Type" },
];
export default function OffersTable({ offers }: Props) {
	const { control, watch } = useForm();
	const [selectedOffers, setSelectedOffers] = useState<Set<string>>(
		new Set([]),
	);
	const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
	const { add, query } = useQueryParams();
	const search = useDebounce(watch("search"), 2000);

	const [runDeleteOffer, { loading }] = useServerAction<
		any,
		typeof deleteOffer
	>(deleteOffer);

	useEffect(() => {
		add("search", search);
	}, [search]);

	const router = useRouter();

	const removeOffer = async (offerId: string) => {
		try {
			if (!offerId) {
				toast.error(ERRORS.MESSAGE.NOT_ALLOWED);
				return;
			}
			await runDeleteOffer(offerId);
			toast.success("Offer deleted successfully");
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	const bulkDeleteOffer = async () => {
		try {
			let offerIds: string[] = [];
			if (typeof selectedOffers === "string") {
				offerIds = offers?.map((user) => user?.id);
			} else {
				offerIds = [...selectedOffers];
			}
			await Promise.all(offerIds?.map((offer) => removeOffer(offer)));
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};
	return (
		<div className='border rounded-md p-3 mt-4'>
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
					onClick={bulkDeleteOffer}
					isDisabled={selectedOffers?.size === 0 || loading}
				>
					Delete offers
				</Button>
			</HStack>
			<Table
				className='mt-4'
				aria-label='list of offers'
				selectionMode='multiple'
				selectionBehavior={"toggle"}
				shadow='none'
				radius='none'
				selectedKeys={selectedOffers}
				onSelectionChange={setSelectedOffers}
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
					{offers?.map((offer) => (
						<TableRow key={offer?.id}>
							<TableCell>
								{new Date(offer?.createdAt)?.toLocaleDateString()}
							</TableCell>
							<TableCell>{offer?.title}</TableCell>
							<TableCell>{offer?.place?.name}</TableCell>
							<TableCell>{offer?.reductionPercent}</TableCell>
							<TableCell>{offer?.price}</TableCell>
							<TableCell>
								<Chip variant='bordered' color='primary'>
									{offer?.type?.name}
								</Chip>
							</TableCell>
							<TableCell>
								<HStack className='items-center justify-end'>
									<Button
										radius='sm'
										size='sm'
										disableRipple
										color='success'
										onClick={() =>
											router.push(DASHBOARD_PATHS.specials.edit(offer?.id))
										}
										isIconOnly
									>
										<PencilIcon className='text-white' size={15} />
									</Button>
									<Button
										radius='sm'
										size='sm'
										disableRipple
										color='danger'
										onClick={() => setSelectedOffer(offer?.id)}
										isIconOnly
									>
										<Trash2Icon className='text-white' size={15} />
									</Button>
								</HStack>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Modal
				isOpen={selectedOffer !== null}
				onClose={() => setSelectedOffer(null)}
				title='Delete Offer'
				description={ERRORS.MESSAGE.DELETE_PROMPT}
				content={
					<HStack className='justify-end'>
						<Button
							variant='bordered'
							radius='sm'
							size='sm'
							onClick={() => setSelectedOffer(null)}
							isDisabled={loading}
						>
							Cancel
						</Button>
						<Button
							color='primary'
							radius='sm'
							size='sm'
							onClick={() => removeOffer(selectedOffer!)}
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
