"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Feature } from "@prisma/client";
import axios from "axios";

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
    try {
      await axios.post(`/api/feature/${featureId}`);
      const updatedFeatureList = await fetchFeatures();
      setFeatureList(updatedFeatureList);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        console.error("An error occurred. Please try again.");
      }
    }
  };

  const fetchFeatures = async () => {
    try {
      const { data } = await axios.get<ExtendedFeature[]>("/api/feature");
      return data;
    } catch (error) {
      console.error("Failed to fetch features:", error);
      return [];
    }
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
