import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import tailwindStyles from "../index.css?inline";
import supabase from "@/supabaseClient";

function Widget({ projectId }) {
  const [rating, setRating] = useState(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSameDomain, setIsSameDomain] = useState(false);

  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      p_project_id: projectId,
      p_user_name: form.name.value,
      p_user_email: form.email.value,
      p_message: form.feedback.value,
      p_rating: rating,
    };
    const { data: returnedData, error } = await supabase.rpc(
      "add_feedback",
      data
    );
    if (error) {
      console.error(error);
    }
    if (returnedData) {
      setIsSubmitted(true);
    }
  };

  // Fetch the project details from Supabase
  useEffect(() => {
    const fetchProjectDetails = async () => {
      const { data, error } = await supabase
        .from("Project")
        .select("*")
        .eq("id", projectId)
        .single(); // Use single() to fetch a single project

      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        if (data?.url) {
          compareDomains(data.url, window.location.href);
        }
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const compareDomains = (projectUrl, currentUrl) => {
    try {
      const projectUrlObj = new URL(projectUrl);
      const currentUrlObj = new URL(currentUrl);
      console.log(projectUrlObj, currentUrlObj);
      // Compare only the domain (hostname), ignoring paths
      if (projectUrlObj.hostname === currentUrlObj.hostname) {
        setIsSameDomain(true); // Domains match
      } else {
        setIsSameDomain(false); // Domains do not match
      }
    } catch (error) {
      console.error("Error comparing domains:", error);
      setIsSameDomain(false);
    }
  };

  if (!isSameDomain) {
    return null;
  }

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full shadow-lg hover:scale-105">
              <MessageIcon className="mr-2 h-5 w-5" /> Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="widget rounded-lg bg-card p-4 shadow-lg w-full max-w-md"
            align="end"
          >
            <style>{tailwindStyles}</style>
            {isSubmitted ? (
              <div>
                <h3 className="text-lg font-bold">
                  Thank you for your feedback!
                </h3>
                <p className="mt-3">
                  We appreciate your feedback. It helps us improve our product
                  and provide better service to our customers.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold">Send us your feedback</h3>
                <form className="space-y-2" onSubmit={onSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Please give your feedback"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          onClick={() => onSelectStar(index)}
                          key={index}
                          className={`h-5 w-5 cursor-pointer ${
                            rating > index
                              ? "fill-primary"
                              : "fill-muted stroke-muted-foreground"
                          } `}
                        />
                      ))}
                    </div>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default Widget;

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      //   className="lucide lucide-star"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MessageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      //   className="lucide lucide-message-circle-plus"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
