import {Router} from "express"
import { chatMessageController, deleteChatController, getAllChatsController, getUserMessageController } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();


chatRouter.post('/message',authUser,chatMessageController);
chatRouter.get('/',authUser,getAllChatsController);
chatRouter.get('/:chatId/messages',authUser,getUserMessageController);
chatRouter.delete('/delete/:chatId',authUser,deleteChatController);

export default chatRouter;