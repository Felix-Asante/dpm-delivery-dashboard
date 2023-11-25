import EmptyContent from "@/components/shared/EmptyContent";
import ForbiddenIllustration from "../../public/svg/illustrations/access-denied.svg";
import { authOptions } from "@/lib/authentication";
import { Session } from "@/types/auth";
import { getServerSession } from "next-auth/next";

interface RoleBasedGuardProps {
	hasContent?: boolean;
	roles?: string[];
	children: React.ReactNode;
}

export default async function RoleBasedGuard({
	hasContent,
	roles,
	children,
}: RoleBasedGuardProps) {
	const session = await getServerSession<typeof authOptions, Session>(
		authOptions,
	);
	const currentRole = session?.user?.role?.name;
	if (!currentRole) return null;
	if (typeof roles !== "undefined" && !roles.includes(currentRole)) {
		return hasContent ? (
			<div className='flex flex-col items-center h-full w-full'>
				<EmptyContent
					title=' Permission Denied'
					description='  You do not have permission to access this page'
					img={ForbiddenIllustration}
				/>
			</div>
		) : null;
	}

	return <>{children}</>;
}
