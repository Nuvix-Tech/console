import { Form, InputField } from "@/components/others";
import { CardBox } from "@/components/others/card";
import { getUserPageState } from "@/state/page";
import { Button, Card, Code, Stack, Text } from "@chakra-ui/react";
import * as y from "yup";

const schema = y.object({
  email: y.string().email().required(),
});

export const UpdateEmail = () => {
  const { user } = getUserPageState();

  return (
    <>
      <Form
        initialValues={{
          email: user?.email,
        }}
        validationSchema={schema}
        onSubmit={() => {
          alert("HELLO SUBMITED");
        }}
      >
        <CardBox
          actions={
            <>
              <Button type="submit">Update</Button>
            </>
          }
        >
          <Stack direction={{ base: "column", md: "row" }} width={"full"} gap={"8"}>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"} gap={"4"}>
              <Card.Title>Email</Card.Title>
              <Text textStyle={"sm"}>
                Update user's email. An Email should be formatted as:{" "}
                <Code variant={"surface"}>name@example.com</Code>.
              </Text>
            </Stack>
            <Stack maxW={{ base: "full", md: "1/2" }} width={"full"}>
              <InputField label={"Email"} name="email" />
            </Stack>
          </Stack>
        </CardBox>
      </Form>
    </>
  );
};
