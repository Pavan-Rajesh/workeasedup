import Navbar from "@/components/Navbar";
import React from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import {
  ChevronRight,
  Axe,
  UserCog,
  MapPin,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
const page = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      {/* <Navbar /> */}
      <MaxWidthWrapper>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 pt-10">
          <Link href="/allocatework">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Allocate work
                  <Axe strokeWidth={2} className="absolute top-5 right-8" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Specify the quantity of workers needed and the nature of the
                  work for your labor requirements
                </p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/reghead">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Register as Head
                  <ChevronRight
                    strokeWidth={1}
                    className="absolute top-5 right-8"
                  />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>You will be having some workers under you.</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
          <Link href="regwork">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Register as worker
                  <ChevronRight
                    strokeWidth={1}
                    className="absolute top-5 right-8"
                  />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Specify the quantity of workers needed and the nature of the
                  work for your labor requirements
                </p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/seleworkers">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Modify workers
                  <UserCog strokeWidth={2} className="absolute top-5 right-8" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This Feature is only available for head if he wants to add or
                  delete workers under him
                </p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/map">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Visualize Locations
                  <MapPin strokeWidth={2} className="absolute top-5 right-8" />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>You can see the Locations of the Contractors and Labours</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/ownerdsh">
            <Card className="relative">
              <CardHeader>
                <CardTitle>
                  Give Rating
                  <MessageSquare
                    strokeWidth={2}
                    className="absolute top-5 right-8"
                  />
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  After the completion of work the Contracter will be giving
                  Rating
                </p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>

          <div>
            <h1>welcome{session.user.email}</h1>
            <div>
              <h3>
                Give work to others Register a work (search for workers){" "}
                <Link href={"/givework"}>register a work</Link>
              </h3>
            </div>
            <div>
              <h3>
                Register as worker in search for work
                <Link href={"/regwork"}>register for work</Link>
              </h3>
            </div>
          </div>
          <div>
            <h3>
              Register as Head
              <Link href={"/reghead"}>register as head</Link>
            </h3>
            <h3>
              Modify workers to add or delete the workers - Feature available
              only for head
              <Link href={"/seleworkers"}>modify workers</Link>
            </h3>
            <h3>
              See locations of workers and owners on the map
              <Link href={"/map"}>
                Get locations of contractors and workers
              </Link>
            </h3>
            <h3>
              owner Dashboard that means owner will be giving rating to heads
              and workers
              <Link href={"/ownerdsh"}>Give ratings to workers and heads</Link>
            </h3>
          </div>
        </div>
        {/* <Footer /> */}
      </MaxWidthWrapper>
    </>
  );
};

export default page;
