import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/model/User";
import Order from "@/model/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Quickcart-next" });
// Ingest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event:'clerk/user.created' },
  async ({ event }) => {
    try {
      console.log("Received event:", event);
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        imageUrl: image_url
      };
      await connectDB();
      await User.create(userData);
      console.log("User created:", userData);
      return { success: true }; // always return something
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      throw error; // let inngest mark it as failed
    }
  }
);

// Ingest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
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
                email:email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                imageUrl: image_url
            }
            await connectDB()
            await User.findByIdAndUpdate(id,userData)
    }
)
//Ingest function to delete user from datavase
export const syncUserdeletion = inngest.createFunction(
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
// function to create user's order
export const createUserOrder = inngest.createFunction(
{
  id:'create-user-order',
  batchEvents: {
    maxSize:25,
    timeout : '5s'

  }
},
{event: 'order/created'},
async({events}) =>{
const orders = events.map((event)=>{
  return {
    userId: event.data.userId,
    items:event.data.itmes,
    amount:event.data.amount,
    address: event.data.address,
    date : event.data.date
  }
})
await connectDB()
  await Order.insertmany(orders)
  return {success:true,processed:orders.length};

}


)