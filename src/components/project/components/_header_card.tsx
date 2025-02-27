import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface HeaderCardProps {
    title: string;

}

export const HeaderCard: React.FC<HeaderCardProps> = ({ title }) => {
    return (
        <>
            <Card className="">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>NO</CardDescription>
                </CardHeader>

                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </>
    )
}