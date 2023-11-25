export const AUTH_ROOT = "/";
export const APP_ROOT = "/";

type RootType = typeof AUTH_ROOT | typeof APP_ROOT;

export const NEXT_AUTH_SIGN_IN_URL = "/api/auth/signin";

function path(root: RootType, sublink: string) {
	return `${root}${sublink}`;
}
export const AUTH_ROUTES = {
	login: path(AUTH_ROOT, "login"),
};
