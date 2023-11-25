import Image from "next/image";
import illustration_empty_content from "../../../public/svg/illustrations/illustration_empty_content.svg";

interface EmptyContentProps {
	title: string;
	description?: string;
	img?: any;
}

export default function EmptyContent({
	title,
	description,
	img,
}: EmptyContentProps) {
	return (
		<div className='w-full flex text-center centers justify-center flex-col items-center  gap-4  py-6 '>
			<Image
				width={240}
				height={240}
				alt='empty content'
				className='w-1/3'
				src={img || illustration_empty_content}
			/>

			<h1 className='font-bold text-2xl  text-white'>{title}</h1>

			{description && (
				<p
					className='
        text-gray-300 text-sm '
				>
					{description}
				</p>
			)}
		</div>
	);
}
