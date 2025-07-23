import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/model/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Quickcart-next" });
// Ingest function to save user data to a database
export const syncUserCreation = inngest.createfunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event:'clerk/user.created'},
        async({event})=>{
            const{id,first_name, last_name, email_addresses, image_url} = event.data
            const userData ={
                _id:id,
                email:email_addresses[0].email_addresses,
                name: first_name + ' ' + last_name,
                imageURL: image_url
            }
            await connectDB()
            await User.create(userData)
            

    }
)
// Ingest function to update user data in database
export const syncUserUpdation = inngest.createfunction(
    {
        id:'update-user-from-clerk'
    },
    {
        event:'clerk/user.updated'
    },
    async({event}) =>{
         const{id,first_name, last_name, email_addresses, image_url} = event.data
            const userData ={
                _id:id,
                email:email_addresses[0].email_addresses,
                name: first_name + ' ' + last_name,
                imageURL: image_url
            }
            await connectDB()
            await User.findByIdAndUpdate(id,userData)
    }
)
//Ingest function to delete user from datavase
export const syncUserdeletion = inngest.createfunction(
{
    id:'delete-user-with-clerk'
},
{event:'clerk/user.deleted'},
async({event}) =>{
    const{id} =event.data
    await connectDB()
    await User.findByIdAndDelete(id)
}
)