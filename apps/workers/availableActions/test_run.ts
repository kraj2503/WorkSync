import { sendEmail } from "./email";
import {publishMessage,findConversation} from "./Slack";


function main() {
    
    const channelId = "C09K3UF6U9Y";
    const msg = 'Hii From bot this iss a test msg'
// findConversation("C09K3UF6U9Y");
// sendEmail("kshitizrazz@gmail.com","adasdasd")
    publishMessage(channelId,msg)
}

main()