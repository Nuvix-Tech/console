"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Plus } from "lucide-react";

interface App {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function ProjectAppsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchApps = async () => {
      try {
        // Simulating API fetch with mock data
        setTimeout(() => {
          setApps([
            {
              id: "1",
              name: "Production App",
              description: "Main production application",
              createdAt: new Date().toISOString(),
              status: "active",
            },
            {
              id: "2",
              name: "Staging App",
              description: "Staging environment for testing",
              createdAt: new Date().toISOString(),
              status: "active",
            },
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch apps:", error);
        setIsLoading(false);
      }
    };

    fetchApps();
  }, [projectId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Apps</h1>
        <Link href={`/project/${projectId}/s/apps/new`}>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            New App
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading apps...</p>
        </div>
      ) : apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Status:{" "}
                    <span className={app.status === "active" ? "text-green-500" : "text-red-500"}>
                      {app.status}
                    </span>
                  </p>
                  <p>Created: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-2">
                <Link href={`/project/${projectId}/s/apps/${app.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No apps found</h3>
          <p className="text-muted-foreground mb-4">Create your first app to get started</p>
          <Link href={`/project/${projectId}/s/apps/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create App
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
