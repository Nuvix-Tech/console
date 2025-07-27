import { cn } from "@nuvix/sui/lib/utils";
import { Checkbox, Column, Fade, Icon, Row, Text } from "@nuvix/ui/components";

export const Schemas = () => {
  const roles = [
    { name: "guests", permissions: ["READ"] },
    { name: "users", permissions: ["CREATE", "READ"] },
    { name: "user:12567", permissions: ["UPDATE"] },
    { name: "team:acme-corp", permissions: ["CREATE", "READ", "UPDATE", "DELETE"] },
  ];

  return (
    <Column fill gap="4">
      <div className="relative w-full pb-24">
        {/* Products Table */}
        <Fade
          to="bottom"
          pattern={{ display: true, size: "4" }}
          blur={0.5}
          base={"transparent" as any}
          fillWidth
        >
          <Column
            background="neutral-alpha-weak"
            padding="4"
            radius="xs"
            fillWidth
            border="neutral-alpha-weak"
          >
            <Text variant="label-strong-xs" onBackground="neutral-medium" className="mb-1 ml-2">
              Products
            </Text>
            <Column background="neutral-weak" overflow="hidden" radius="xs-4" border="neutral-weak">
              <Row
                gap="12"
                vertical="center"
                paddingX="12"
                paddingY="8"
                background="neutral-alpha-weak"
                overflow="hidden"
                borderBottom="neutral-weak"
              >
                {["NAME", "CATEGORY", "PRICE", "STOCK"].map((h, i) => (
                  <Text
                    key={h}
                    variant="body-strong-xs"
                    onBackground="neutral-medium"
                    className={i === 0 ? "w-32 max-w-32 truncate" : ""}
                  >
                    {h}
                  </Text>
                ))}
              </Row>
              {[
                { product: "Laptop", category: "Electronics", price: "$1200", stock: 15 },
                { product: "Desk Chair", category: "Furniture", price: "$150", stock: 40 },
                { product: "Coffee Mug", category: "Kitchen", price: "$12", stock: 120 },
                { product: "Notebook", category: "Stationery", price: "$5", stock: 200 },
              ].map((item, idx) => (
                <Row
                  key={item.product}
                  gap="12"
                  vertical="center"
                  paddingX="12"
                  paddingY="8"
                  horizontal="space-between"
                  borderBottom="neutral-weak"
                >
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    className="w-32 max-w-32 truncate"
                  >
                    {item.product}
                  </Text>
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    className="w-24 max-w-24 truncate"
                  >
                    {item.category}
                  </Text>
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    className="w-16 max-w-16 truncate"
                  >
                    {item.price}
                  </Text>
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    className="w-12 max-w-12 truncate"
                  >
                    {item.stock}
                  </Text>
                </Row>
              ))}
            </Column>
          </Column>
        </Fade>

        <Column
          background="transparent"
          overflow="hidden"
          className="-rotate-5 group-hover:-rotate-10 transition-all backdrop-blur-xs absolute bottom-5 -right-4 w-11/12"
          radius="xs"
          border="neutral-alpha-weak"
        >
          <Row
            gap="12"
            vertical="center"
            paddingX="12"
            paddingY="8"
            overflow="hidden"
            borderBottom="neutral-weak"
            background="neutral-alpha-weak"
          >
            {["ROLE", "CREATE", "READ", "UPDATE", "DELETE"].map((h, i) => (
              <Text
                key={h}
                variant="body-strong-xs"
                onBackground="neutral-medium"
                className={cn("!text-[10px]", { "w-20 max-w-20 truncate": i === 0 })}
              >
                {h}
              </Text>
            ))}
          </Row>
          {roles.map((role) => (
            <Row
              key={role.name}
              gap="12"
              vertical="center"
              paddingX="12"
              paddingY="4"
              horizontal="space-between"
            >
              <Text
                variant="body-default-s"
                onBackground="neutral-weak"
                className="w-20 max-w-20 truncate"
              >
                {role.name}
              </Text>
              {["CREATE", "READ", "UPDATE", "DELETE"].map((permission) => (
                <Checkbox
                  key={permission}
                  isChecked={role.permissions.includes(permission)}
                  disabled={!role.permissions.includes(permission)}
                  className="mx-auto"
                  checkboxClass="!w-4 !h-4 !min-w-4 !min-h-4"
                />
              ))}
            </Row>
          ))}
        </Column>
      </div>

      <Column gap="4" className="mt-auto">
        {[
          "Secure by Default",
          "Row & Table Security",
          "Document-Like Collections",
          "Rule-Based Managed Tables",
          "Raw SQL Control",
          "Granular Role Permissions",
          "Schema-Level Access Control",
          "Schema Flexibility",
          "Instant API Generation",
          "Powered by PostgreSQL",
        ].map((feature, index) => (
          <Row key={feature} gap="8" vertical="center">
            <Icon name="check" size="xs" onBackground="neutral-medium" />
            <Text variant="body-default-s" onBackground="neutral-medium">
              {feature}
            </Text>
          </Row>
        ))}
      </Column>
    </Column>
  );
};
