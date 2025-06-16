"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@repo/config";
export default function Dashboard() {
  const router = useRouter();
    const [loading, task] = useTasks();

  function createNewWork() {
    router.push("/Create");
  }
    
    
  return (
    <div className=" pt-8 flex justify-center">
      <div className="max-w-screen-lg w-full">
        <div className="flex justify-between">
          <div className="">My tasks</div>
          <Button variant={"purple"}>Create</Button>
        </div>
          </div>
          {loading? "Loading...": <Tasks task={task} />
    </div>
  );
}

function useTasks() {
    const [loading, setLoading] = useState(true);
    const [task, setTasks] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/task/getTasks`).then((res) => {
            setTasks(res.data.task)
        });
    }, []);


}


function Tasks({ task }: {task:Task[]}) {
    return (
        <div className="">
            <div>
                

</div>

        </div>
    )
}