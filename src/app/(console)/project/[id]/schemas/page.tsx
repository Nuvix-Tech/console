'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Spinner } from '@chakra-ui/react';

// This is just a placeholder. Replace with your actual schema type
interface Schema {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function SchemasPage() {
    const { id } = useParams();
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch schemas for the current project
        async function fetchSchemas() {
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`/api/projects/${id}/schemas`);
                const data = await response.json();
                setSchemas(data);
            } catch (error) {
                console.error('Error fetching schemas:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSchemas();
    }, [id]);

    const filteredSchemas = schemas.filter(schema =>
        schema.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Project Schemas</h1>
                <Button className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    <span>New Schema</span>
                </Button>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search schemas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {loading ? (
                <div className="flex justify-center my-12">
                    <Spinner size="lg" />
                </div>
            ) : filteredSchemas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchemas.map((schema) => (
                        <Card key={schema.id}>
                            <CardHeader>
                                <CardTitle>{schema.name}</CardTitle>
                                <CardDescription>
                                    Last updated: {new Date(schema.updatedAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">{schema.description || 'No description provided'}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit2 size={14} className="mr-1" />
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm">
                                    <Trash2 size={14} className="mr-1" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No schemas found</p>
                    <p className="text-gray-400">Create a new schema to get started</p>
                </div>
            )}
        </div>
    );
}