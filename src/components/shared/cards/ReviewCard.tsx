"use client";
import React from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Avatar,
	Button,
	useDisclosure,
} from "@nextui-org/react";
import { Ratings } from "@/types/ratings";
import { getErrorMessage, getInitials, pluralize } from "@/utils/helpers";
import Modal from "../modal";
import { useServerAction } from "@/hooks/useServerAction";
import { deleteRating } from "@/actions/ratings";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
	rating: Ratings;
}
export default function ReviewCard({ rating }: Props) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [runDeleteReview, { loading }] = useServerAction<
		any,
		typeof deleteRating
	>(deleteRating);

	const queryClient = useQueryClient();

	const onConfirmDelete = async () => {
		try {
			const response = await runDeleteReview(rating?.id);
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			toast.success("Review deleted");
			queryClient.invalidateQueries({
				queryKey: ["getReviews", rating?.booking?.place?.id],
			});
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<div>
			<Card className='max-w-[340px] h-fit' shadow='sm'>
				<CardHeader className='justify-between'>
					<div className='flex gap-3'>
						<Avatar
							isBordered
							radius='full'
							size='sm'
							fallback={getInitials(rating?.user?.fullName)}
						/>
						<div className='flex flex-col gap-1 items-start justify-center'>
							<h4 className='text-small font-semibold line-clamp-1 leading-none text-default-600'>
								{rating?.user?.fullName}
							</h4>
						</div>
					</div>
					<Button
						onClick={onOpen}
						disableRipple
						color='primary'
						radius='full'
						size='sm'
					>
						Delete
					</Button>
				</CardHeader>
				<CardBody className='px-3 py-0 text-small text-default-400'>
					<p>{rating?.comment}</p>
				</CardBody>
				<CardFooter className='gap-3 justify-between'>
					<div className='flex gap-1'>
						<p className='font-semibold text-default-400 text-small'>Date:</p>
						<p className='text-default-400 text-small'>
							{new Date(rating?.createdAt).toLocaleDateString()}
						</p>
					</div>
					<div className='flex gap-1'>
						<p className=' text-default-400 text-small'>
							{rating?.rating} {pluralize("star", rating?.rating)}
						</p>
					</div>
				</CardFooter>
			</Card>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='Delete review'
				description='Are you sure you want to delete this review?'
				content={
					<div className='flex flex-col gap-3'>
						<div className='flex gap-3'>
							<Button
								disableRipple
								color='secondary'
								onClick={onClose}
								isDisabled={loading}
							>
								Cancel
							</Button>
							<Button
								color='primary'
								onClick={onConfirmDelete}
								isLoading={loading}
							>
								Continue
							</Button>
						</div>
					</div>
				}
			/>
		</div>
	);
}
