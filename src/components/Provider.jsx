"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
const queryClient = new QueryClient();

export default function Provider({ children }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ProgressBar
          height="4px"
          color="#2563EB"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </QueryClientProvider>
    </>
  );
}
