import React from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
const Features = () => {
  return (
    <section className="flex flex-col gap-5  h-auto">
      <Card className="w-full h-52 flex  flex-row justify-between items-center border-2 border-primary">
        <div>
          <CardHeader>
            <CardTitle className="text-left">Occupation Matching</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="text-left">
            Connects workers and owners based on occupation.
          </CardContent>
        </div>
        <div>
          <Image src="/map1.png" width={300} height={350} alt="map1" />
        </div>
      </Card>
      <Card className="w-full h-52 flex flex-row justify-between items-center border-2 border-primary">
        <div>
          <Image src="/map-2.png" width={300} height={350} alt="map1" />
        </div>
        <div>
          <CardHeader>
            <CardTitle className="text-right">Distance Matching</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="text-right">
            Matches workers and owners based on Distance between them.
          </CardContent>
        </div>
      </Card>
      <Card className="w-full h-52 flex  flex-row justify-between items-center border-2 border-primary">
        <div>
          <CardHeader>
            <CardTitle className="text-left"> Contractor selection</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="text-left">
            Workers can choose Contractors based on their preffered location.
          </CardContent>
        </div>
        <div>
          <Image
            src="/personselection.png"
            width={300}
            height={350}
            alt="map1"
          />
        </div>
      </Card>
    </section>
  );
};

export default Features;
