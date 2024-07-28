"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Feature {
  id: string;
  title: string;
  description: string;
  _count: {
    votes: number;
  };
  userHasVoted: boolean;
}

const FeatureList = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeatures = async () => {
      const response = await fetch('/api/feature');
      const data: Feature[] = await response.json();
      setFeatures(data);
    };

    fetchFeatures();
  }, []);

  const handleVote = async (featureId: string) => {
    const response = await fetch(`/api/feature/${featureId}`, {
      method: 'POST',
    });

    if (response.ok) {
      const fetchFeatures = async () => {
        const response = await fetch('/api/feature');
        const data: Feature[] = await response.json();
        setFeatures(data);
      };

      fetchFeatures();
    } else {
      const data = await response.json();
      console.error(data.error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFeatures = features
    .filter(feature => 
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b._count.votes - a._count.votes);

  return (
    <CardContent className="flex flex-col p-5">
      <Input 
        type="text" 
        placeholder="Search features" 
        value={searchTerm} 
        onChange={handleSearchChange} 
        className="mb-4"
      />
      {filteredFeatures.map((feature) => (
        <div key={feature.id} className="flex flex-col gap-2">
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
          <Button onClick={() => handleVote(feature.id)} variant={"ghost"}>
            {feature.userHasVoted ? "Voted" : <ArrowUp/>}&nbsp;{feature._count.votes}
          </Button>
        </div>
      ))}
    </CardContent>
  );
};

export default FeatureList;
