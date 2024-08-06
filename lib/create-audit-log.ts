import { auth, currentUser } from "@clerk/nextjs/server"
import {ACTION, TYPE} from "@prisma/client"
import { redirect } from "next/navigation"
import { db } from "./db"
interface Props{
    Id: string
    type: TYPE
    title: string
    action: ACTION
}
export const Auditlog = async(props: Props) =>{
    try{
        const {orgId} = auth()
        const user = await currentUser()
        if(!user || !orgId){
            redirect("/")
        }
        const {Id, type, title, action} = props
        await db.audit.create({
            data:{
                orgId, 
                entity: Id,
                type,
                title, 
                action,
                userId: user.id,
                userImage: user.imageUrl,
                username: user.firstName + " " + user.lastName
            }
        })
    } catch (error){
        console.log("LOG_ERRROR", error)
    }
}