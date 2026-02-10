import { cn } from "@nuvix/sui/lib/utils";
import { Background, Icon, Text } from "@nuvix/ui/components";
import React from "react";

type ColorType = React.ComponentProps<typeof Icon>["onBackground"];

interface CardContentProps {
  icon: React.ComponentProps<typeof Icon>["name"];
  iconBackground?: string;
  iconOnBackground?: ColorType;
  title: string;
  description: string;
  titleOnBackground?: ColorType;
  descriptionOnBackground?: ColorType;
  imageSrc: string;
  imageAlt?: string;
  imageHeight?: string;
}

const CardContent = ({
  icon,
  iconBackground = "bg-(--neutral-alpha-medium)",
  iconOnBackground = "neutral-medium",
  title,
  description,
  titleOnBackground = "neutral-strong",
  descriptionOnBackground = "neutral-weak",
  imageSrc,
  imageAlt = "Preview",
  imageHeight = "h-78",
}: CardContentProps) => {
  return (
    <>
      <div className="py-8 pl-4 max-w-sm space-y-4 relative">
        <Icon
          name={icon}
          decorative
          className={cn(
            iconBackground,
            "border neutral-border-strong rounded-full size-5 p-2",
            "!hidden md:!block",
          )}
          onBackground={iconOnBackground}
        />
        <Text as="h3" variant="display-strong-xs" onBackground={titleOnBackground}>
          {title}
        </Text>
        <Text
          as="p"
          variant="body-default-m"
          onBackground={descriptionOnBackground}
          className="mt-4"
        >
          {description}
        </Text>
      </div>
      <div className="mt-auto -mr-6 -mb-6">
        <div className="bg-(--neutral-alpha-medium) border neutral-border-medium rounded-tl-sm p-2">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(imageHeight, "rounded-tl-xs", "max-sm:!h-auto")}
          />
        </div>
      </div>
    </>
  );
};

function Card1() {
  return (
    <CardWrapper
      data-theme="dark"
      className="page-background"
      bg={{
        gradient: {
          display: true,
          tilt: 10,
          height: 200,
          y: 50,
          x: 20,
          colorEnd: "neutral-background-weak",
          colorStart: "brand-background-medium",
        },
      }}
    >
      <CardContent
        icon="checkCircle"
        title="Control Everything in One Place"
        description="Manage projects, monitor usage, and oversee every service from a single console. Designed for clarity and efficiency so you can navigate your system without friction."
        imageSrc="/images/dashboard/home.png"
        imageAlt="Home Dashboard"
      />
    </CardWrapper>
  );
}

function Card2() {
  return (
    <CardWrapper
      className="page-background"
      bg={{
        gradient: {
          display: true,
          tilt: 10,
          height: 200,
          y: 50,
          x: 20,
          colorEnd: "neutral-alpha-weak",
          colorStart: "accent-solid-medium",
        },
        dots: {
          display: true,
          size: "4",
          color: "neutral-alpha-medium",
        },
      }}
    >
      <CardContent
        icon="rocket"
        iconOnBackground="accent-strong"
        title="Build Faster with Smart Tools"
        description="Edit data through a spreadsheet style interface built for speed. Perform bulk actions, inline edits, and structured updates with a workflow that feels natural."
        descriptionOnBackground="accent-strong"
        imageSrc="/images/dashboard/table-editor-light.png"
        imageAlt="Table Editor"
        imageHeight="h-88"
      />
    </CardWrapper>
  );
}

function Card3() {
  return (
    <CardWrapper
      className="page-background"
      bg={{
        gradient: {
          display: true,
          tilt: 10,
          height: 200,
          y: 50,
          x: 20,
          colorEnd: "brand-background-medium",
          colorStart: "neutral-background-strong",
        },
        grid: {
          display: true,
          height: "4px",
          opacity: 30,
          width: "4px",
          color: "brand-alpha-weak",
        },
      }}
    >
      <CardContent
        icon="security"
        iconOnBackground="neutral-strong"
        title="Powerful Permissions with Ease"
        description="A unified permission engine that handles users, guests, teams, and labels effortlessly.
Every rule is enforced consistently across data models, storage, and operations without writing a single SQL policy."
        descriptionOnBackground="neutral-medium"
        imageSrc="/images/dashboard/secure-perms.png"
        imageAlt="Security Overview"
        imageHeight="h-88"
      />
    </CardWrapper>
  );
}

const cardComponents = [Card1, Card2, Card3];

const CARD_TOP_BASE = 80; // px — where the first card sticks
const CARD_TOP_STEP = 20; // px — offset between each card's sticky top

export default function StickyStackCards() {
  return (
    <div className="relative w-full px-4 cont">
      {cardComponents.map((CardComponent, idx) => (
        <div
          key={idx}
          className="sticky"
          style={{
            top: `${CARD_TOP_BASE + idx * CARD_TOP_STEP}px`,
            zIndex: idx + 1,
            marginBottom:
              idx < cardComponents.length - 1
                ? `calc(100vh - ${CARD_TOP_BASE + idx * CARD_TOP_STEP + 420}px)`
                : undefined,
          }}
        >
          <CardComponent />
        </div>
      ))}
    </div>
  );
}

const CardWrapper = ({
  children,
  bg,
  className,
  ...rest
}: {
  children: React.ReactNode;
  bg: React.ComponentProps<typeof Background>;
} & React.ComponentProps<"div">) => {
  return (
    <div className={cn("relative w-full  radius-s overflow-hidden z-[1]", className)} {...rest}>
      <Background className="-z-[1] !overflow-hidden radius-s !absolute" {...bg} />
      <div className="p-4 size-full h-[32rem] lg:h-96 flex justify-between flex-col lg:flex-row">
        {children}
      </div>
    </div>
  );
};
