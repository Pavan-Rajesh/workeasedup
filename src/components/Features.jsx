import React from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
const Features = () => {
  return (
    <section className="flex flex-col gap-5  h-auto">
      <Card className="w-full h-52 flex  flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-left">Occupation Matching</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-left">
          Connects workers and owners based on occupation.
        </CardContent>
      </Card>
      <Card className="w-full h-52 flex  flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-right">Distance Matching</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          Matches workers and owners based on Distance between them.
        </CardContent>
      </Card>
      <Card className="w-full h-52 flex  flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-left"> Contractor selection</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-left">
          Workers can choose Contractors based on their preffered location.
        </CardContent>
      </Card>
    </section>
  );
};

export default Features;
