"use client"
import { useState } from "react";
import Appbar from "../components/Appbar";
import { TaskCell } from "../components/taskCell";


export default function () {
     
    const [selectedTrigger, setSelectedTrigger] = useState("")
    const [selectedAction ,setSelectedAction] = useState([])

    return (
        <>
            {/* <Appbar /> */}
            <div className=" flex justify-center">

         <TaskCell name = {selectedTrigger?selectedTrigger:"Trigger"} index = {1}/>


            </div>
        </>
    )
}
    
