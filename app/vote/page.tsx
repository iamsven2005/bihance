"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FeatureForm from './FeatureForm';
import FeatureList from './FeatureList';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

const HomePage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();

      if (!userId) {
        return reject(notFound());
      }

      const features = await db.feature.findMany({
        include: {
          _count: {
            select: { votes: true },
          },
          votes: {
            where: { userId: userId },
            select: { id: true },
          },
        },
      });

      const formattedFeatures = features.map((feature) => ({
        ...feature,
        userHasVoted: feature.votes.length > 0,
      }));

      return resolve(
        <Card className="home-page">
          <CardHeader>
            <CardTitle>Feature Suggestions</CardTitle>
            <CardDescription>
              If you would like us to add new features suggest it here and see it get included.
            </CardDescription>
            <FeatureForm />
          </CardHeader>
          <FeatureList features={formattedFeatures} />
        </Card>
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default HomePage;
