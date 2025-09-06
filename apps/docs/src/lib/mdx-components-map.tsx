import { SmartLink, Text, InlineCode } from "@nuvix/ui/components";
import { MDXComponents } from "mdx/types";

export const baseMdxComponents: MDXComponents = {
  h1: (props) => (
    <Text as="h1" variant="heading-default-xl" marginTop="12" marginBottom="8" {...props} />
  ),
  h2: (props) => (
    <Text as="h2" variant="heading-default-l" marginTop="12" marginBottom="8" {...props} />
  ),
  h3: (props) => (
    <Text as="h3" variant="heading-default-m" marginTop="12" marginBottom="8" {...props} />
  ),
  h4: (props) => (
    <Text as="h4" variant="heading-default-s" marginTop="12" marginBottom="8" {...props} />
  ),
  p: (props) => <Text as="p" variant="body-default-s" {...props} />,
  a: (props) => <SmartLink {...props} />,
  // ul: (props) => <UnorderedList pl="5" {...props} />,
  // ol: (props) => <OrderedList pl="5" {...props} />,
  // li: (props) => <ListItem mb="1" {...props} />,
  code: (props) => <InlineCode {...props} />,
  // pre: (props) => (
  //     <Box as="pre" bg="bg.muted" rounded="md" p="4" overflowX="auto" fontSize="sm" {...props} />
  // ),
  Text,
  // textDecoration="underline"
};
