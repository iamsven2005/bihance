import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList } from "@clerk/nextjs";

const Page = () => {
    return ( 
        <Card className="mx-auto justify-center flex flex-col gap-5 items-center m-5 p-5">
            <CardTitle>
                Create an organization to start.
            </CardTitle>
        <OrganizationList
        hidePersonal/>

        </Card>
     );
}
 
export default Page;