import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { HStack, Skeleton, Stack } from "@chakra-ui/react";

export const DataGridSkelton = ({
  loading = true,
  variant = "pulse",
}: { loading?: boolean; variant?: "pulse" | "shine" }) => {
  return (
    <Stack gap="8">
      <HStack width="full" justifyContent={"space-between"}>
        <Skeleton height="40px" width={"250px"} variant={variant} loading={loading} />
        <Skeleton height="40px" width={"100px"} variant={variant} loading={loading} />
      </HStack>
      <Skeleton height="350px" variant={variant} loading={loading} />
      <HStack width="full" justifyContent={"space-between"}>
        <HStack gap={"3"}>
          <Skeleton height="40px" width={"80px"} variant={variant} loading={loading} />
          <SkeletonText width={"150px"} noOfLines={1} variant={variant} loading={loading} />
        </HStack>
        <HStack gap={"6"} alignItems={"center"}>
          <SkeletonCircle height="20px" width={"20px"} variant={variant} loading={loading} />
          <Skeleton height="40px" width={"40px"} variant={variant} loading={loading} />
          <SkeletonCircle height="20px" width={"20px"} variant={variant} loading={loading} />
        </HStack>
      </HStack>
    </Stack>
  );
};
