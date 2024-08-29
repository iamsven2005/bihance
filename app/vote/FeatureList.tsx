"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Feature } from "@prisma/client";

interface ExtendedFeature extends Feature {
  _count: {
    votes: number;
  };
  userHasVoted: boolean;
}

interface Props {
  features: ExtendedFeature[];
}

const FeatureListClient: React.FC<Props> = ({ features }) => {
  const [featureList, setFeatureList] = useState<ExtendedFeature[]>(features);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVote = async (featureId: string) => {
    const response = await fetch(`/api/feature/${featureId}`, {
      method: "POST",
    });

    if (response.ok) {
      const updatedFeatureList = await fetchFeatures();
      setFeatureList(updatedFeatureList);
    } else {
      const data = await response.json();
      console.error(data.error);
    }
  };

  const fetchFeatures = async () => {
    const response = await fetch("/api/feature");
    const data: ExtendedFeature[] = await response.json();
    return data;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFeatures = featureList
    .filter(
      (feature) =>
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b._count.votes - a._count.votes);

  return (
    <div className="flex flex-col p-5">
      <Input
        type="text"
        placeholder="Search features"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4"
      />
      {filteredFeatures.map((feature) => (
        <div key={feature.id} className="flex flex-col gap-2">
          <h2>{feature.title}</h2>
          <p>{feature.description}</p>
          <Button onClick={() => handleVote(feature.id)} variant={"ghost"}>
            {feature.userHasVoted ? "Voted" : <ArrowUp />} &nbsp;{feature._count.votes}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeatureListClient;
