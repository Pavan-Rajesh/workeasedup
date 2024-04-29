/**
 * Here in the ownerdash board we will be showing the workers and a button to their profile so when the owner clicks the    * button you will be directed to another page and then owner will be giving rating to the worker then from the owner table
 * the workers uuid will be deleted and status of the worker will be updated that is isworking to true or false
 *
 *
 */

import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

import Link from "next/link";

const Page = () => {
  // const [workersDetails, setWorkersDetails] = useState([]);
  // const [head, setHeadDetails] = useState([]);
  // const [headWorkers, setheadWorkers] = useState([]);

<<<<<<< HEAD
  useEffect(() => {
    async function fetchWorkersworked() {
      fetch("/api/ownerdash")
        .then((data) => data.json())
        .then((data) => {
          /**
           *  here we will be selecting data.workers because we will be sending with some data from backend 
           *  return NextResponse.json({
           *    workers: workersDetails,
           *     message: "This Worked",
           *     success: true,
  });
           * 
           */
          setWorkersDetails(data.workers);
          console.log(data.workers);
        });
    }
    fetchWorkersworked();
  }, []);
=======
  // useEffect(() => {
  //   fetch("http://localhost:3000/api/ownerdash")
  //     .then((data) => data.json())
  //     .then((data) => {
  //       /**
  //          *  here we will be selecting data.workers because we will be sending with some data from backend
  //          *  return NextResponse.json({
  //          *    workers: workersDetails,
  //          *     message: "This Worked",
  //          *     success: true,
  // });
  //          *
  //          */
  //       // console.log(data.ownerWorkers);
  //       setWorkersDetails(data.ownerWorkers[0].workers);
  //       setHeadDetails(data.ownerWorkers[0].head);
  //       setheadWorkers(data.ownerWorkers[0].headWorkers);
  //     });
  // }, []);
>>>>>>> 9028ae7c6720e8bfd16ab44e283e05d233173ae1

  return (
    <div className="grid gap-5 grid-cols-1  md:grid-cols-2 pt-10 w-full">
      <Link href="/headwithwhole">
        <Card className="relative">
          <CardHeader>
            <CardTitle>
              Rate Troup
              <ChevronRight
                strokeWidth={1}
                className="absolute top-5 right-8"
              />
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p>Rate the workers under the head with head included</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/ratingtoindividual">
        <Card className="relative">
          <CardHeader>
            <CardTitle>
              Rate Individuals
              <ChevronRight
                strokeWidth={1}
                className="absolute top-5 right-8"
              />
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p>Rate the Individual workers apart from head</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};

export default Page;
{
  /* {workersDetails.map((workCompletedWorker) => {
        return (
          <div key={workCompletedWorker}>
            {workCompletedWorker}
            <Link href={`/giverating/${workCompletedWorker}`}>
              {workCompletedWorker}
            </Link>
          </div>
        );
      })} 
     
        <Link
          href="/headwithwhole"
          className={buttonVariants({ variant: "link" })}
        >
          give rating to the whole troup
        </Link>
        <Link href="/ratingtoindividual">
          give rating to the Individual workers
        </Link> */
}
