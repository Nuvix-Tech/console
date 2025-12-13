import { useNavigate, useLocation, useParams } from "react-router";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),

    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)), // query params
    asPath: location.pathname + location.search + location.hash,
    params, // dynamic route params
  };
}
