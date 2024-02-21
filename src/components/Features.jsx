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
    <section className="border-2 border-green-600">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-center">Occupation Matching</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          Connects workers and owners based on occupation.
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-center">Distance Matching</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          Matches workers and owners based on Distance between them.
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-center"> Contractor selection</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          Workers can choose Contractors based on their preffered location.
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </section>
  );
};

export default Features;
