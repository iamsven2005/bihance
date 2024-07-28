"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FeatureForm from './FeatureForm';
import FeatureList from './FeatureList';

const HomePage = () => {
  return (
    <Card className="home-page">
      <CardHeader>
      <CardTitle>Feature Suggestions</CardTitle>
      <CardDescription>
      If you would like us to add new features suggest it here and see it get included.
      </CardDescription>
      <FeatureForm />
      </CardHeader>
      <FeatureList />
    </Card>
  );
};

export default HomePage;
