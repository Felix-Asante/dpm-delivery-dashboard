import { Query } from "@/types/url";
import { toQuery } from "@/utils/helpers";

export const AUTH_ROOT = "/";
export const DASHBOARD_ROOT = "/";

type RootType = typeof AUTH_ROOT | typeof DASHBOARD_ROOT;

export const NEXT_AUTH_SIGN_IN_URL = "/api/auth/signin";

function path(root: RootType, sublink: string) {
	return `${root}${sublink}`;
}
export const AUTH_ROUTES = {
	login: path(AUTH_ROOT, "login"),
};

export const DASHBOARD_PATHS = {
	root: DASHBOARD_ROOT,
	account: {
		settings: path(DASHBOARD_ROOT, "account/settings"),
	},
	categories: {
		root: (query?: Query) =>
			path(DASHBOARD_ROOT, `categories${toQuery(query ?? {})}`),
	},
	places: {
		root: path(DASHBOARD_ROOT, "places"),
		new: path(DASHBOARD_ROOT, "places/new-place"),
		edit: (placeId: string) => path(DASHBOARD_ROOT, `places/edit/${placeId}`),
	},
	bookings: {
		root: path(DASHBOARD_ROOT, "bookings"),
	},
	users: {
		root: path(DASHBOARD_ROOT, "users"),
	},
	specials: {
		root: path(DASHBOARD_ROOT, "specials"),
	},
};
