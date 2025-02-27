'use client'
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const { databaseId, collectionId, documentId } = params;
    return (
        <div>
            Database: {databaseId}, Collection: {collectionId}, Document: {documentId}
        </div>
    )
}
