"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const FeatureForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await axios.post('/api/feature', { title, description });
      setTitle('');
      setDescription('');
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data.error || 'An error occurred. Please try again.');
      } else {
        console.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Feature Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Feature Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button type="submit">Submit Feature</Button>
    </form>
  );
};

export default FeatureForm;
