const express=require('express');
const TaskModel = require('../models/task.model');
const auth=require('../middlewares/auth.middlware')
const taskRouter=express.Router();

taskRouter.post('/create', async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    console.log(req.body);
    try {
        const task = new TaskModel({
            title,
            description,
            status,
            dueDate,
            user: req.user._id,
        });
        console.log("welcome");
        await task.save();
        res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error while creating task" });
    }
});

taskRouter.get('/',auth,async(req,res)=>{
    try {
        const tasks = await TaskModel.find({ user: req.user._id });
    
        const categorizedTasks = {
          todo: tasks.filter(task => task.status === 'to-do'),
          inProgress: tasks.filter(task => task.status === 'in-Progress'),
          done: tasks.filter(task => task.status === 'done'),
        };
    
        res.json(categorizedTasks);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
})

taskRouter.patch('/update/:id',async(req,res)=>{
  const payload=req.body;
  const taskId=req.params.id;
  const user=req.user._id;
  try {
    const task=await TaskModel.findOne({_id:taskId})
    if(task.user.toString()==user){
      await TaskModel.findByIdAndUpdate({_id:taskId},payload)
      return res.status(200).json({message:"Task updated successfully"})
    }
  } catch (error) {
    res.status(500).json({message:"Error while updating task"})
  }
})

taskRouter.delete('/delete/:id',async(req,res)=>{
    const taskId=req.params.id;
    const user=req.user._id;
    try {
        const task=await TaskModel.findOne({_id:taskId})
        if(task.user.toString()==user){
            await TaskModel.findByIdAndDelete({_id:taskId})
            return res.status(200).json({message:"Task deleted successfully"})
        }
        else{
            return res.status(400).json({message:"unauthorized"})
        }
    } catch (error) {
        res.status(500).json({message:"Error while deleting task"})
    }
})
module.exports=taskRouter;