import { Button } from "@/components";
import { useUsers } from "@/hooks";
import { Card, Flex, Icon, TabPanel, Text, Title } from "@tremor/react";
import { ShieldAlert, User } from "lucide-react";
import { CreateUser } from "./Create";

type Props = {
  tenantId: string;
};

export const Users = ({ tenantId }: Props) => {
  const { data: users, isLoading, isError, error } = useUsers(tenantId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TabPanel>
      <Flex flexDirection="col" className="gap-4">
        {users.map((user) => (
          <Card>
            <Flex justifyContent="between">
              <Flex justifyContent="start">
                <Icon
                  size="xl"
                  icon={user.role === "User" ? User : ShieldAlert}
                  color="stone"
                />
                <Flex flexDirection="col" alignItems="start">
                  <Title>
                    {user.firstName} {user.lastName}
                  </Title>
                  <Text>{user.email}</Text>
                </Flex>
              </Flex>
              <Button variant="primaryDark" size="small">
                Modify
              </Button>
            </Flex>
          </Card>
        ))}
        <CreateUser tenantId={tenantId} />
      </Flex>
    </TabPanel>
  );
};
